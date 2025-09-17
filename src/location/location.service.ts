import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Ds } from './entities/ds.entity';
import { Zone } from './entities/zone.entity';
import { Gnd } from './entities/gnd.entity';
import { Repository, In } from 'typeorm';
import { LocationResponseDto } from './dto/location-response.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Province) private provinceRepo: Repository<Province>,
    @InjectRepository(District) private districtRepo: Repository<District>,
    @InjectRepository(Ds) private dsRepo: Repository<Ds>,
    @InjectRepository(Zone) private zoneRepo: Repository<Zone>,
    @InjectRepository(Gnd) private gndRepo: Repository<Gnd>,
  ) {}

  getProvinces() {
    return this.provinceRepo.find({ where: { status: true } });
  }

  getDistricts(provinceId: string) {
    return this.districtRepo.find({
      where: { province_id: provinceId, status: true },
    });
  }

  getDsDivisions(districtId: string) {
    return this.dsRepo.find({
      where: { district_id: districtId, status: true },
    });
  }

  getZones(dsId: string) {
    return this.zoneRepo.find({ where: { ds_id: dsId, status: true } });
  }

  getGnds(zoneId: string) {
    return this.gndRepo.find({ where: { zone_id: zoneId, status: true } });
  }

  async getLocations(
    districtId?: string,
    dsId?: string,
    zoneId?: string,
  ): Promise<LocationResponseDto> {
    const response = new LocationResponseDto();

    if (!districtId && !dsId && !zoneId) {
      // Return all districts
      response.districts = (await this.districtRepo.find()).map((d) => ({
        id: d.district_id,
        name: d.district_name,
      }));
      return response;
    }

    if (districtId && !dsId && !zoneId) {
      // Return district and its DS divisions
      const district = await this.districtRepo.findOne({
        where: { district_id: districtId },
      });
      if (!district) {
        return response;
      }

      response.districts = [
        {
          id: district.district_id,
          name: district.district_name,
        },
      ];

      response.dss = (
        await this.dsRepo.find({ where: { district_id: districtId } })
      ).map((ds) => ({
        id: ds.ds_id,
        name: ds.ds_name,
        districtId: ds.district_id,
      }));

      return response;
    }

    if (districtId && dsId && !zoneId) {
      // Return district, DS division, and its zones and GNDs
      const district = await this.districtRepo.findOne({
        where: { district_id: districtId },
      });
      const ds = await this.dsRepo.findOne({ where: { ds_id: dsId } });

      if (!district || !ds) {
        return response;
      }

      response.districts = [
        {
          id: district.district_id,
          name: district.district_name,
        },
      ];

      response.dss = [
        {
          id: ds.ds_id,
          name: ds.ds_name,
          districtId: ds.district_id,
        },
      ];

      response.zones = (
        await this.zoneRepo.find({ where: { ds_id: dsId } })
      ).map((zone) => ({
        id: zone.zone_id,
        name: zone.zone_name,
        dsId: zone.ds_id,
      }));

      response.gnds = (
        await this.gndRepo.find({
          where: {
            zone_id: In(
              (await this.zoneRepo.find({ where: { ds_id: dsId } })).map(
                (z) => z.zone_id,
              ),
            ),
          },
        })
      ).map((gnd) => ({
        id: gnd.gnd_id,
        name: gnd.gnd_name,
        zoneId: gnd.zone_id,
      }));

      return response;
    }

    if (districtId && dsId && zoneId) {
      // Return district, DS division, zone, and its GNDs
      const district = await this.districtRepo.findOne({
        where: { district_id: districtId },
      });
      const ds = await this.dsRepo.findOne({ where: { ds_id: dsId } });
      const zone = await this.zoneRepo.findOne({ where: { zone_id: zoneId } });

      if (!district || !ds || !zone) {
        return response;
      }

      response.districts = [
        {
          id: district.district_id,
          name: district.district_name,
        },
      ];

      response.dss = [
        {
          id: ds.ds_id,
          name: ds.ds_name,
          districtId: ds.district_id,
        },
      ];

      response.zones = [
        {
          id: zone.zone_id,
          name: zone.zone_name,
          dsId: zone.ds_id,
        },
      ];

      response.gnds = (
        await this.gndRepo.find({ where: { zone_id: zoneId } })
      ).map((gnd) => ({
        id: gnd.gnd_id,
        name: gnd.gnd_name,
        zoneId: gnd.zone_id,
      }));

      return response;
    }

    return response;
  }
}
