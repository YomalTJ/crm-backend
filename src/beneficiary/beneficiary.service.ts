import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  BeneficiaryFilterDto,
  DemographicFilterDto,
} from './dto/beneficiary-filter.dto';
import { BeneficiaryResponseDto } from './dto/beneficiary-response.dto';
import { DemographicResponseDto } from './dto/demographic-response.dto';
import { ProjectOwnerFilterDto } from './dto/project-owner-filter.dto';
import { ProjectOwnerResponseDto } from './dto/project-owner-response.dto';
import { AreaTypeFilterDto } from './dto/area-type-filter.dto';
import { AreaTypeResponseDto } from './dto/area-type-response.dto';
import { BeneficiaryCountFilterDto } from './dto/beneficiary-count-filter.dto';
import {
  BeneficiaryCountResponseDto,
  ProgramCountDto,
  YearlyProgramCountDto,
} from './dto/beneficiary-count-response.dto';
import { EmpowermentRefusalResponseDto } from './dto/empowerment-refusal-response.dto';
import { EmpowermentRefusalFilterDto } from './dto/empowerment-refusal-filter.dto';
import { BeneficiaryTypeCountFilterDto } from './dto/beneficiary-type-count-filter.dto';
import { BeneficiaryTypeCountResponseDto } from './dto/beneficiary-type-count-response.dto';
import { EmpowermentDimensionCountResponseDto } from './dto/empowerment-dimension-count-response.dto';
import { EmpowermentDimensionCountFilterDto } from './dto/empowerment-dimension-count-filter.dto';

@Injectable()
export class BeneficiaryService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async getBeneficiaries(
    filter: BeneficiaryFilterDto,
  ): Promise<BeneficiaryResponseDto[]> {
    let query = `
      SELECT 
        sf.mainProgram as mainProgram,
        sf.projectOwnerName as projectOwnerName,
        sf.projectOwnerAge as projectOwnerAge,
        sf.projectOwnerGender as projectOwnerGender,
        d.district_id as district_id,
        d.district_name as district_name,
        ds.ds_id as ds_id,
        ds.ds_name as ds_name,
        z.zone_id as zone_id,
        z.zone_name as zone_name,
        g.gnd_id as gnd_id,
        g.gnd_name as gnd_name,
        dis.disability_id as disability_id,
        dis.name_en as disability_name_en,
        dis.name_si as disability_name_si,
        dis.name_ta as disability_name_ta,
        bs.beneficiary_type_id as beneficiary_type_id,
        bs.nameEnglish as beneficiary_name_english,
        bs.nameSinhala as beneficiary_name_sinhala,
        bs.nameTamil as beneficiary_name_tamil
      FROM samurdhi_family sf
      LEFT JOIN districts d ON sf.district_id = d.district_id
      LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
      LEFT JOIN zone z ON sf.zone_id = z.zone_id
      LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
      LEFT JOIN disability dis ON sf.disability_id = dis.disability_id
      LEFT JOIN beneficiary_status bs ON sf.beneficiary_type_id = bs.beneficiary_type_id
      WHERE sf.disability_id IS NOT NULL
    `;

    const paramValues: any[] = [];

    if (filter.district_id) {
      query += ' AND d.district_id = ?';
      paramValues.push(filter.district_id);
    }

    if (filter.ds_id) {
      query += ' AND ds.ds_id = ?';
      paramValues.push(filter.ds_id);
    }

    if (filter.zone_id) {
      query += ' AND z.zone_id = ?';
      paramValues.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      query += ' AND g.gnd_id = ?';
      paramValues.push(filter.gnd_id);
    }

    if (filter.mainProgram) {
      query += ' AND sf.mainProgram = ?';
      paramValues.push(filter.mainProgram);
    }

    if (filter.beneficiary_type_id) {
      query += ' AND bs.beneficiary_type_id = ?';
      paramValues.push(filter.beneficiary_type_id);
    }

    const results = await this.entityManager.query(query, paramValues);

    return results.map((result) => ({
      district: {
        district_id: result.district_id,
        district_name: result.district_name,
      },
      ds: {
        ds_id: result.ds_id,
        ds_name: result.ds_name,
      },
      zone: {
        zone_id: result.zone_id,
        zone_name: result.zone_name,
      },
      gnd: {
        gnd_id: result.gnd_id,
        gnd_name: result.gnd_name,
      },
      mainProgram: result.mainProgram,
      projectOwnerName: result.projectOwnerName,
      projectOwnerAge: result.projectOwnerAge,
      projectOwnerGender: result.projectOwnerGender,
      disability: {
        disability_id: result.disability_id,
        nameEN: result.disability_name_en,
        nameSi: result.disability_name_si,
        nameTa: result.disability_name_ta,
      },
      beneficiaryType: result.beneficiary_type_id
        ? {
            beneficiary_type_id: result.beneficiary_type_id,
            nameEnglish: result.beneficiary_name_english,
            nameSinhala: result.beneficiary_name_sinhala,
            nameTamil: result.beneficiary_name_tamil,
          }
        : undefined,
    }));
  }

  async getDemographicStatistics(
    filter: DemographicFilterDto,
  ): Promise<DemographicResponseDto[]> {
    let query = `
    SELECT 
      sf.mainProgram as mainProgram,
      sf.projectOwnerName as projectOwnerName,
      d.district_id as district_id,
      d.district_name as district_name,
      ds.ds_id as ds_id,
      ds.ds_name as ds_name,
      z.zone_id as zone_id,
      z.zone_name as zone_name,
      g.gnd_id as gnd_id,
      g.gnd_name as gnd_name,
      bs.beneficiary_type_id as beneficiary_type_id,
      bs.nameEnglish as beneficiary_name_english,
      bs.nameSinhala as beneficiary_name_sinhala,
      bs.nameTamil as beneficiary_name_tamil,
      
      -- Age and gender demographics
      COALESCE(sf.maleBelow16, 0) as maleBelow16,
      COALESCE(sf.femaleBelow16, 0) as femaleBelow16,
      COALESCE(sf.male16To24, 0) as male16To24,
      COALESCE(sf.female16To24, 0) as female16To24,
      COALESCE(sf.male25To45, 0) as male25To45,
      COALESCE(sf.female25To45, 0) as female25To45,
      COALESCE(sf.male46To60, 0) as male46To60,
      COALESCE(sf.female46To60, 0) as female46To60,
      COALESCE(sf.maleAbove60, 0) as maleAbove60,
      COALESCE(sf.femaleAbove60, 0) as femaleAbove60,
      
      -- Totals
      (COALESCE(sf.maleBelow16, 0) + COALESCE(sf.femaleBelow16, 0) + 
       COALESCE(sf.male16To24, 0) + COALESCE(sf.female16To24, 0) + 
       COALESCE(sf.male25To45, 0) + COALESCE(sf.female25To45, 0) + 
       COALESCE(sf.male46To60, 0) + COALESCE(sf.female46To60, 0) +
       COALESCE(sf.maleAbove60, 0) + COALESCE(sf.femaleAbove60, 0)) as totalFamilyMembers,
       
      (COALESCE(sf.maleBelow16, 0) + COALESCE(sf.male16To24, 0) + 
       COALESCE(sf.male25To45, 0) + COALESCE(sf.male46To60, 0) + 
       COALESCE(sf.maleAbove60, 0)) as totalMale,
       
      (COALESCE(sf.femaleBelow16, 0) + COALESCE(sf.female16To24, 0) + 
       COALESCE(sf.female25To45, 0) + COALESCE(sf.female46To60, 0) + 
       COALESCE(sf.femaleAbove60, 0)) as totalFemale

    FROM samurdhi_family sf
    LEFT JOIN districts d ON sf.district_id = d.district_id
    LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
    LEFT JOIN zone z ON sf.zone_id = z.zone_id
    LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
    LEFT JOIN beneficiary_status bs ON sf.beneficiary_type_id = bs.beneficiary_type_id
    WHERE 1=1
  `;

    const paramValues: any[] = [];

    if (filter.district_id) {
      query += ' AND d.district_id = ?';
      paramValues.push(filter.district_id);
    }

    if (filter.ds_id) {
      query += ' AND ds.ds_id = ?';
      paramValues.push(filter.ds_id);
    }

    if (filter.zone_id) {
      query += ' AND z.zone_id = ?';
      paramValues.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      query += ' AND g.gnd_id = ?';
      paramValues.push(filter.gnd_id);
    }

    if (filter.mainProgram) {
      query += ' AND sf.mainProgram = ?';
      paramValues.push(filter.mainProgram);
    }

    if (filter.beneficiary_type_id) {
      query += ' AND bs.beneficiary_type_id = ?';
      paramValues.push(filter.beneficiary_type_id);
    }

    // Age range filtering based on family members
    if (filter.minAge !== undefined && filter.maxAge !== undefined) {
      // Filter for families that have members in the specified age range
      query += ` AND (
      -- Check if any family member falls within the age range
      (sf.maleBelow16 > 0 AND ? <= 15 AND ? >= 0) OR
      (sf.femaleBelow16 > 0 AND ? <= 15 AND ? >= 0) OR
      (sf.male16To24 > 0 AND ? <= 24 AND ? >= 16) OR
      (sf.female16To24 > 0 AND ? <= 24 AND ? >= 16) OR
      (sf.male25To45 > 0 AND ? <= 45 AND ? >= 25) OR
      (sf.female25To45 > 0 AND ? <= 45 AND ? >= 25) OR
      (sf.male46To60 > 0 AND ? <= 60 AND ? >= 46) OR
      (sf.female46To60 > 0 AND ? <= 60 AND ? >= 46) OR
      (sf.maleAbove60 > 0 AND ? >= 61) OR
      (sf.femaleAbove60 > 0 AND ? >= 61)
    )`;

      // Push minAge and maxAge for each age range check
      for (let i = 0; i < 10; i++) {
        paramValues.push(filter.minAge, filter.maxAge);
      }
    }

    // Specific age range filtering
    if (filter.specificAgeRange) {
      switch (filter.specificAgeRange) {
        case 'below16':
          query += ' AND (sf.maleBelow16 > 0 OR sf.femaleBelow16 > 0)';
          break;
        case '16To24':
          query += ' AND (sf.male16To24 > 0 OR sf.female16To24 > 0)';
          break;
        case '25To45':
          query += ' AND (sf.male25To45 > 0 OR sf.female25To45 > 0)';
          break;
        case '46To60':
          query += ' AND (sf.male46To60 > 0 OR sf.female46To60 > 0)';
          break;
        case 'above60':
          query += ' AND (sf.maleAbove60 > 0 OR sf.femaleAbove60 > 0)';
          break;
      }
    }

    console.log('SQL Query:', query);
    console.log('Parameters:', paramValues);

    const results = await this.entityManager.query(query, paramValues);

    return results.map((result) => ({
      district: {
        district_id: result.district_id,
        district_name: result.district_name,
      },
      ds: {
        ds_id: result.ds_id,
        ds_name: result.ds_name,
      },
      zone: {
        zone_id: result.zone_id,
        zone_name: result.zone_name,
      },
      gnd: {
        gnd_id: result.gnd_id,
        gnd_name: result.gnd_name,
      },
      mainProgram: result.mainProgram,
      projectOwnerName: result.projectOwnerName,

      demographics: {
        totalFamilyMembers: result.totalFamilyMembers,
        totalMale: result.totalMale,
        totalFemale: result.totalFemale,

        ageRanges: {
          below16: {
            male: result.maleBelow16,
            female: result.femaleBelow16,
            total: result.maleBelow16 + result.femaleBelow16,
          },
          age16To24: {
            male: result.male16To24,
            female: result.female16To24,
            total: result.male16To24 + result.female16To24,
          },
          age25To45: {
            male: result.male25To45,
            female: result.female25To45,
            total: result.male25To45 + result.female25To45,
          },
          age46To60: {
            male: result.male46To60,
            female: result.female46To60,
            total: result.male46To60 + result.female46To60,
          },
          above60: {
            male: result.maleAbove60,
            female: result.femaleAbove60,
            total: result.maleAbove60 + result.femaleAbove60,
          },
        },
      },

      beneficiaryType: result.beneficiary_type_id
        ? {
            beneficiary_type_id: result.beneficiary_type_id,
            nameEnglish: result.beneficiary_name_english,
            nameSinhala: result.beneficiary_name_sinhala,
            nameTamil: result.beneficiary_name_tamil,
          }
        : undefined,
    }));
  }

  async getProjectOwnerDetails(
    filter: ProjectOwnerFilterDto,
  ): Promise<ProjectOwnerResponseDto[]> {
    let query = `
    SELECT 
      sf.mainProgram as mainProgram,
      sf.beneficiaryName as beneficiaryName,
      sf.address as address,
      sf.mobilePhone as mobilePhone,
      sf.telephone as telephone,
      sf.projectOwnerName as projectOwnerName,
      sf.projectOwnerAge as projectOwnerAge,
      sf.projectOwnerGender as projectOwnerGender,
      
      d.district_id as district_id,
      d.district_name as district_name,
      ds.ds_id as ds_id,
      ds.ds_name as ds_name,
      z.zone_id as zone_id,
      z.zone_name as zone_name,
      g.gnd_id as gnd_id,
      g.gnd_name as gnd_name,
      
      -- Empowerment Dimension
      ed.empowerment_dimension_id as empowerment_dimension_id,
      ed.nameEnglish as empowerment_name_english,
      ed.nameSinhala as empowerment_name_sinhala,
      ed.nameTamil as empowerment_name_tamil,
      
      -- Livelihood
      l.id as livelihood_id,
      l.english_name as livelihood_english_name,
      l.sinhala_name as livelihood_sinhala_name,
      l.tamil_name as livelihood_tamil_name,
      
      -- Project Type
      pt.project_type_id as project_type_id,
      pt.nameEnglish as project_type_english,
      pt.nameSinhala as project_type_sinhala,
      pt.nameTamil as project_type_tamil,
      
      -- Beneficiary Type
      bs.beneficiary_type_id as beneficiary_type_id,
      bs.nameEnglish as beneficiary_name_english,
      bs.nameSinhala as beneficiary_name_sinhala,
      bs.nameTamil as beneficiary_name_tamil

    FROM samurdhi_family sf
    LEFT JOIN districts d ON sf.district_id = d.district_id
    LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
    LEFT JOIN zone z ON sf.zone_id = z.zone_id
    LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
    LEFT JOIN empowerment_dimension ed ON sf.empowerment_dimension_id = ed.empowerment_dimension_id
    LEFT JOIN livelihoods l ON sf.livelihood_id = l.id
    LEFT JOIN project_type pt ON sf.project_type_id = pt.project_type_id
    LEFT JOIN beneficiary_status bs ON sf.beneficiary_type_id = bs.beneficiary_type_id
    WHERE 1=1
  `;

    const paramValues: any[] = [];

    if (filter.district_id) {
      query += ' AND d.district_id = ?';
      paramValues.push(filter.district_id);
    }

    if (filter.ds_id) {
      query += ' AND ds.ds_id = ?';
      paramValues.push(filter.ds_id);
    }

    if (filter.zone_id) {
      query += ' AND z.zone_id = ?';
      paramValues.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      query += ' AND g.gnd_id = ?';
      paramValues.push(filter.gnd_id);
    }

    if (filter.mainProgram) {
      query += ' AND sf.mainProgram = ?';
      paramValues.push(filter.mainProgram);
    }

    if (filter.beneficiary_type_id) {
      query += ' AND bs.beneficiary_type_id = ?';
      paramValues.push(filter.beneficiary_type_id);
    }

    const results = await this.entityManager.query(query, paramValues);

    return results.map((result) => ({
      district: {
        district_id: result.district_id,
        district_name: result.district_name,
      },
      ds: {
        ds_id: result.ds_id,
        ds_name: result.ds_name,
      },
      zone: {
        zone_id: result.zone_id,
        zone_name: result.zone_name,
      },
      gnd: {
        gnd_id: result.gnd_id,
        gnd_name: result.gnd_name,
      },
      mainProgram: result.mainProgram,
      beneficiaryName: result.beneficiaryName,
      address: result.address,
      mobilePhone: result.mobilePhone,
      telephone: result.telephone,
      projectOwnerName: result.projectOwnerName,
      projectOwnerAge: result.projectOwnerAge,
      projectOwnerGender: result.projectOwnerGender,

      empowermentDimension: result.empowerment_dimension_id
        ? {
            empowerment_dimension_id: result.empowerment_dimension_id,
            nameEnglish: result.empowerment_name_english,
            nameSinhala: result.empowerment_name_sinhala,
            nameTamil: result.empowerment_name_tamil,
          }
        : undefined,

      livelihood: result.livelihood_id
        ? {
            id: result.livelihood_id,
            english_name: result.livelihood_english_name,
            sinhala_name: result.livelihood_sinhala_name,
            tamil_name: result.livelihood_tamil_name,
          }
        : undefined,

      projectType: result.project_type_id
        ? {
            project_type_id: result.project_type_id,
            nameEnglish: result.project_type_english,
            nameSinhala: result.project_type_sinhala,
            nameTamil: result.project_type_tamil,
          }
        : undefined,

      beneficiaryType: result.beneficiary_type_id
        ? {
            beneficiary_type_id: result.beneficiary_type_id,
            nameEnglish: result.beneficiary_name_english,
            nameSinhala: result.beneficiary_name_sinhala,
            nameTamil: result.beneficiary_name_tamil,
          }
        : undefined,
    }));
  }

  async getAreaTypeStatistics(
    filter: AreaTypeFilterDto,
  ): Promise<AreaTypeResponseDto[]> {
    // Map enum values to actual database values
    const areaClassificationMap = {
      URBAN: 'නාගරික/ Urban/ நகர்ப்புற',
      RURAL: 'ග්‍රාමීය/ Rural/ கிராமப்புறம்',
      ESTATE: 'වතු/ Estates / எஸ்டேட்ஸ்',
    };

    let query = `
    SELECT 
      sf.areaClassification as areaClassification,
      sf.mainProgram as mainProgram,
      d.district_id as district_id,
      d.district_name as district_name,
      ds.ds_id as ds_id,
      ds.ds_name as ds_name,
      z.zone_id as zone_id,
      z.zone_name as zone_name,
      g.gnd_id as gnd_id,
      g.gnd_name as gnd_name
    FROM samurdhi_family sf
    LEFT JOIN districts d ON sf.district_id = d.district_id
    LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
    LEFT JOIN zone z ON sf.zone_id = z.zone_id
    LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
    WHERE sf.areaClassification IS NOT NULL
  `;

    const paramValues: any[] = [];
    const whereClauses: string[] = [];

    if (filter.district_id) {
      whereClauses.push('d.district_id = ?');
      paramValues.push(filter.district_id);
    }

    if (filter.ds_id) {
      whereClauses.push('ds.ds_id = ?');
      paramValues.push(filter.ds_id);
    }

    if (filter.zone_id) {
      whereClauses.push('z.zone_id = ?');
      paramValues.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      whereClauses.push('g.gnd_id = ?');
      paramValues.push(filter.gnd_id);
    }

    if (filter.mainProgram) {
      whereClauses.push('sf.mainProgram = ?');
      paramValues.push(filter.mainProgram);
    }

    if (filter.areaClassification) {
      const dbValue = areaClassificationMap[filter.areaClassification];
      whereClauses.push('sf.areaClassification = ?');
      paramValues.push(dbValue);
    }

    if (whereClauses.length > 0) {
      query += ' AND ' + whereClauses.join(' AND ');
    }

    const results = await this.entityManager.query(query, paramValues);

    // Group results by location first, then by program
    const groupedResults = {};

    results.forEach((result) => {
      // Create a unique key for location grouping (excluding mainProgram)
      const locationKey = [
        result.district_id,
        result.ds_id,
        result.zone_id,
        result.gnd_id,
      ].join('-');

      if (!groupedResults[locationKey]) {
        groupedResults[locationKey] = {
          district: result.district_id
            ? {
                district_id: result.district_id,
                district_name: result.district_name,
              }
            : undefined,
          ds: result.ds_id
            ? {
                ds_id: result.ds_id,
                ds_name: result.ds_name,
              }
            : undefined,
          zone: result.zone_id
            ? {
                zone_id: result.zone_id,
                zone_name: result.zone_name,
              }
            : undefined,
          gnd: result.gnd_id
            ? {
                gnd_id: result.gnd_id,
                gnd_name: result.gnd_name,
              }
            : undefined,
          programs: {}, // This will store programs by mainProgram value
        };
      }

      // Initialize program if it doesn't exist
      if (!groupedResults[locationKey].programs[result.mainProgram]) {
        groupedResults[locationKey].programs[result.mainProgram] = {
          mainProgram: result.mainProgram,
          areaTypeCounts: {
            URBAN: 0,
            RURAL: 0,
            ESTATE: 0,
            total: 0,
          },
        };
      }

      // Map database values back to enum values for counting
      let areaType: 'URBAN' | 'RURAL' | 'ESTATE' = 'RURAL';
      if (result.areaClassification === areaClassificationMap.URBAN) {
        areaType = 'URBAN';
      } else if (result.areaClassification === areaClassificationMap.ESTATE) {
        areaType = 'ESTATE';
      }

      // Update counts for this program
      groupedResults[locationKey].programs[result.mainProgram].areaTypeCounts[
        areaType
      ]++;
      groupedResults[locationKey].programs[result.mainProgram].areaTypeCounts
        .total++;
    });

    // Convert the programs object to an array and return
    return (
      Object.values(groupedResults) as Array<{
        district?: any;
        ds?: any;
        zone?: any;
        gnd?: any;
        programs: { [mainProgram: string]: any };
      }>
    ).map((locationGroup) => ({
      district: locationGroup.district,
      ds: locationGroup.ds,
      zone: locationGroup.zone,
      gnd: locationGroup.gnd,
      programs: Object.values(locationGroup.programs),
    }));
  }

  async getBeneficiaryCountByYear(
    filter: BeneficiaryCountFilterDto,
  ): Promise<BeneficiaryCountResponseDto> {
    // First, get the counts grouped by year and program
    let countQuery = `
    SELECT 
      EXTRACT(YEAR FROM sf.createdAt) as year,
      sf.mainProgram as mainProgram,
      COUNT(sf.id) as count
    FROM samurdhi_family sf
    WHERE EXTRACT(YEAR FROM sf.createdAt) IN (2025, 2026, 2027)
  `;

    const countParams: any[] = [];

    if (filter.district_id) {
      countQuery += ' AND sf.district_id = ?';
      countParams.push(filter.district_id);
    }

    if (filter.ds_id) {
      countQuery += ' AND sf.ds_id = ?';
      countParams.push(filter.ds_id);
    }

    if (filter.zone_id) {
      countQuery += ' AND sf.zone_id = ?';
      countParams.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      countQuery += ' AND sf.gnd_id = ?';
      countParams.push(filter.gnd_id);
    }

    if (filter.mainProgram) {
      countQuery += ' AND sf.mainProgram = ?';
      countParams.push(filter.mainProgram);
    }

    if (filter.years && filter.years.length > 0) {
      countQuery += ' AND EXTRACT(YEAR FROM sf.createdAt) IN (?)';
      countParams.push(filter.years);
    }

    countQuery += ' GROUP BY year, mainProgram ORDER BY year, mainProgram';

    const countResults = await this.entityManager.query(
      countQuery,
      countParams,
    );

    // Group results by year
    const yearlyData: { [year: number]: ProgramCountDto[] } = {};

    countResults.forEach((result) => {
      const year = parseInt(result.year);
      const program = result.mainProgram;
      const count = parseInt(result.count);

      if (!yearlyData[year]) {
        yearlyData[year] = [];
      }

      yearlyData[year].push({
        mainProgram: program,
        count: count,
      });
    });

    // Convert to the desired array format
    const data: YearlyProgramCountDto[] = Object.keys(yearlyData).map(
      (year) => {
        const yearNum = parseInt(year);
        return {
          year: yearNum,
          programs: yearlyData[yearNum],
        };
      },
    );

    // Get location information separately if location filters were applied
    let location: any = undefined;
    const hasLocationFilter =
      filter.district_id || filter.ds_id || filter.zone_id || filter.gnd_id;

    if (hasLocationFilter) {
      let locationQuery = `
      SELECT 
        d.district_id as district_id,
        d.district_name as district_name,
        ds.ds_id as ds_id,
        ds.ds_name as ds_name,
        z.zone_id as zone_id,
        z.zone_name as zone_name,
        g.gnd_id as gnd_id,
        g.gnd_name as gnd_name
      FROM samurdhi_family sf
      LEFT JOIN districts d ON sf.district_id = d.district_id
      LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
      LEFT JOIN zone z ON sf.zone_id = z.zone_id
      LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
      WHERE EXTRACT(YEAR FROM sf.createdAt) IN (2025, 2026, 2027)
    `;

      const locationParams: any[] = [];

      if (filter.district_id) {
        locationQuery += ' AND sf.district_id = ?';
        locationParams.push(filter.district_id);
      }

      if (filter.ds_id) {
        locationQuery += ' AND sf.ds_id = ?';
        locationParams.push(filter.ds_id);
      }

      if (filter.zone_id) {
        locationQuery += ' AND sf.zone_id = ?';
        locationParams.push(filter.zone_id);
      }

      if (filter.gnd_id) {
        locationQuery += ' AND sf.gnd_id = ?';
        locationParams.push(filter.gnd_id);
      }

      if (filter.mainProgram) {
        locationQuery += ' AND sf.mainProgram = ?';
        locationParams.push(filter.mainProgram);
      }

      if (filter.years && filter.years.length > 0) {
        locationQuery += ' AND EXTRACT(YEAR FROM sf.createdAt) IN (?)';
        locationParams.push(filter.years);
      }

      locationQuery += ' LIMIT 1';

      const locationResults = await this.entityManager.query(
        locationQuery,
        locationParams,
      );
      const locationResult = locationResults[0];

      if (locationResult) {
        location = {
          district: locationResult.district_id
            ? {
                district_id: locationResult.district_id,
                district_name: locationResult.district_name,
              }
            : undefined,
          ds: locationResult.ds_id
            ? {
                ds_id: locationResult.ds_id,
                ds_name: locationResult.ds_name,
              }
            : undefined,
          zone: locationResult.zone_id
            ? {
                zone_id: locationResult.zone_id,
                zone_name: locationResult.zone_name,
              }
            : undefined,
          gnd: locationResult.gnd_id
            ? {
                gnd_id: locationResult.gnd_id,
                gnd_name: locationResult.gnd_name,
              }
            : undefined,
        };
      }
    }

    return {
      data,
      location,
    };
  }

  async getEmpowermentRefusalReasons(
    filter: EmpowermentRefusalFilterDto,
  ): Promise<EmpowermentRefusalResponseDto[]> {
    let query = `
    SELECT 
      sf.beneficiaryName as beneficiaryName,
      sf.nic as nic,
      sf.mobilePhone as mobilePhone,
      sf.address as address,
      sf.mainProgram as mainProgram,
      sf.createdAt as createdAt,
      
      -- Refusal Reason
      err.id as refusal_reason_id,
      err.reason_si as refusal_reason_si,
      err.reason_en as refusal_reason_en,
      err.reason_ta as refusal_reason_ta,
      
      -- Location
      d.district_id as district_id,
      d.district_name as district_name,
      ds.ds_id as ds_id,
      ds.ds_name as ds_name,
      z.zone_id as zone_id,
      z.zone_name as zone_name,
      g.gnd_id as gnd_id,
      g.gnd_name as gnd_name
      
    FROM samurdhi_family sf
    INNER JOIN empowerment_refusal_reasons err ON sf.refusal_reason_id = err.id
    LEFT JOIN districts d ON sf.district_id = d.district_id
    LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
    LEFT JOIN zone z ON sf.zone_id = z.zone_id
    LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
    WHERE sf.refusal_reason_id IS NOT NULL
  `;

    const paramValues: any[] = [];

    if (filter.district_id) {
      query += ' AND sf.district_id = ?';
      paramValues.push(filter.district_id);
    }

    if (filter.ds_id) {
      query += ' AND sf.ds_id = ?';
      paramValues.push(filter.ds_id);
    }

    if (filter.zone_id) {
      query += ' AND sf.zone_id = ?';
      paramValues.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      query += ' AND sf.gnd_id = ?';
      paramValues.push(filter.gnd_id);
    }

    if (filter.mainProgram) {
      query += ' AND sf.mainProgram = ?';
      paramValues.push(filter.mainProgram);
    }

    query += ' ORDER BY sf.createdAt DESC';

    const results = await this.entityManager.query(query, paramValues);

    return results.map((result) => ({
      beneficiaryName: result.beneficiaryName,
      nic: result.nic,
      mobilePhone: result.mobilePhone,
      address: result.address,
      mainProgram: result.mainProgram,
      refusalReason: {
        id: result.refusal_reason_id,
        reason_si: result.refusal_reason_si,
        reason_en: result.refusal_reason_en,
        reason_ta: result.refusal_reason_ta,
      },
      location: {
        district: result.district_id
          ? {
              district_id: result.district_id,
              district_name: result.district_name,
            }
          : undefined,
        ds: result.ds_id
          ? {
              ds_id: result.ds_id,
              ds_name: result.ds_name,
            }
          : undefined,
        zone: result.zone_id
          ? {
              zone_id: result.zone_id,
              zone_name: result.zone_name,
            }
          : undefined,
        gnd: result.gnd_id
          ? {
              gnd_id: result.gnd_id,
              gnd_name: result.gnd_name,
            }
          : undefined,
      },
      createdAt: result.createdAt,
    }));
  }

  async getBeneficiaryTypeCounts(
    filter: BeneficiaryTypeCountFilterDto,
  ): Promise<BeneficiaryTypeCountResponseDto> {
    // Get counts for each beneficiary type
    let countQuery = `
    SELECT 
      bs.beneficiary_type_id as beneficiary_type_id,
      bs.nameEnglish as nameEnglish,
      bs.nameSinhala as nameSinhala,
      bs.nameTamil as nameTamil,
      COUNT(sf.id) as count
    FROM samurdhi_family sf
    INNER JOIN beneficiary_status bs ON sf.beneficiary_type_id = bs.beneficiary_type_id
    WHERE bs.beneficiary_type_id IN (
      '77744e4d-48a4-4295-8a5d-38d2100599f9', -- Previous Samurdhi beneficiary
      'a8625875-41a4-47cf-9cb3-d2d185b7722d'  -- Aswasuma beneficiary
    )
  `;

    const countParams: any[] = [];

    if (filter.district_id) {
      countQuery += ' AND sf.district_id = ?';
      countParams.push(filter.district_id);
    }

    if (filter.ds_id) {
      countQuery += ' AND sf.ds_id = ?';
      countParams.push(filter.ds_id);
    }

    if (filter.zone_id) {
      countQuery += ' AND sf.zone_id = ?';
      countParams.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      countQuery += ' AND sf.gnd_id = ?';
      countParams.push(filter.gnd_id);
    }

    countQuery += ' GROUP BY bs.beneficiary_type_id ORDER BY bs.nameEnglish';

    const countResults = await this.entityManager.query(
      countQuery,
      countParams,
    );

    // Get location information separately if location filters were applied
    let location: any = undefined;
    const hasLocationFilter =
      filter.district_id || filter.ds_id || filter.zone_id || filter.gnd_id;

    if (hasLocationFilter) {
      let locationQuery = `
      SELECT 
        d.district_id as district_id,
        d.district_name as district_name,
        ds.ds_id as ds_id,
        ds.ds_name as ds_name,
        z.zone_id as zone_id,
        z.zone_name as zone_name,
        g.gnd_id as gnd_id,
        g.gnd_name as gnd_name
      FROM samurdhi_family sf
      LEFT JOIN districts d ON sf.district_id = d.district_id
      LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
      LEFT JOIN zone z ON sf.zone_id = z.zone_id
      LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
      WHERE 1=1
    `;

      const locationParams: any[] = [];

      if (filter.district_id) {
        locationQuery += ' AND sf.district_id = ?';
        locationParams.push(filter.district_id);
      }

      if (filter.ds_id) {
        locationQuery += ' AND sf.ds_id = ?';
        locationParams.push(filter.ds_id);
      }

      if (filter.zone_id) {
        locationQuery += ' AND sf.zone_id = ?';
        locationParams.push(filter.zone_id);
      }

      if (filter.gnd_id) {
        locationQuery += ' AND sf.gnd_id = ?';
        locationParams.push(filter.gnd_id);
      }

      locationQuery += ' LIMIT 1';

      const locationResults = await this.entityManager.query(
        locationQuery,
        locationParams,
      );
      const locationResult = locationResults[0];

      if (locationResult) {
        location = {
          district: locationResult.district_id
            ? {
                district_id: locationResult.district_id,
                district_name: locationResult.district_name,
              }
            : undefined,
          ds: locationResult.ds_id
            ? {
                ds_id: locationResult.ds_id,
                ds_name: locationResult.ds_name,
              }
            : undefined,
          zone: locationResult.zone_id
            ? {
                zone_id: locationResult.zone_id,
                zone_name: locationResult.zone_name,
              }
            : undefined,
          gnd: locationResult.gnd_id
            ? {
                gnd_id: locationResult.gnd_id,
                gnd_name: locationResult.gnd_name,
              }
            : undefined,
        };
      }
    }

    return {
      counts: countResults.map((result) => ({
        beneficiary_type_id: result.beneficiary_type_id,
        nameEnglish: result.nameEnglish,
        nameSinhala: result.nameSinhala,
        nameTamil: result.nameTamil,
        count: parseInt(result.count),
      })),
      location,
    };
  }

  async getEmpowermentDimensionCounts(
    filter: EmpowermentDimensionCountFilterDto,
  ): Promise<EmpowermentDimensionCountResponseDto> {
    // Get counts for each empowerment dimension
    let countQuery = `
    SELECT 
      ed.empowerment_dimension_id as empowerment_dimension_id,
      ed.nameEnglish as nameEnglish,
      ed.nameSinhala as nameSinhala,
      ed.nameTamil as nameTamil,
      COUNT(sf.id) as count
    FROM samurdhi_family sf
    INNER JOIN empowerment_dimension ed ON sf.empowerment_dimension_id = ed.empowerment_dimension_id
    WHERE ed.empowerment_dimension_id IN (
      '247029ca-e2fd-4741-aea2-6d22e2fc32b0', -- Employment Facilitation
      '2edd58f6-8d1e-463a-9f1a-47bbe3f107a0'  -- Business Opportunities/Self-Employment
    )
  `;

    const countParams: any[] = [];

    if (filter.district_id) {
      countQuery += ' AND sf.district_id = ?';
      countParams.push(filter.district_id);
    }

    if (filter.ds_id) {
      countQuery += ' AND sf.ds_id = ?';
      countParams.push(filter.ds_id);
    }

    if (filter.zone_id) {
      countQuery += ' AND sf.zone_id = ?';
      countParams.push(filter.zone_id);
    }

    if (filter.gnd_id) {
      countQuery += ' AND sf.gnd_id = ?';
      countParams.push(filter.gnd_id);
    }

    if (filter.mainProgram) {
      countQuery += ' AND sf.mainProgram = ?';
      countParams.push(filter.mainProgram);
    }

    countQuery +=
      ' GROUP BY ed.empowerment_dimension_id ORDER BY ed.nameEnglish';

    const countResults = await this.entityManager.query(
      countQuery,
      countParams,
    );

    // Get location information separately if location filters were applied
    let location: any = undefined;
    const hasLocationFilter =
      filter.district_id || filter.ds_id || filter.zone_id || filter.gnd_id;

    if (hasLocationFilter) {
      let locationQuery = `
      SELECT 
        d.district_id as district_id,
        d.district_name as district_name,
        ds.ds_id as ds_id,
        ds.ds_name as ds_name,
        z.zone_id as zone_id,
        z.zone_name as zone_name,
        g.gnd_id as gnd_id,
        g.gnd_name as gnd_name
      FROM samurdhi_family sf
      LEFT JOIN districts d ON sf.district_id = d.district_id
      LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
      LEFT JOIN zone z ON sf.zone_id = z.zone_id
      LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
      WHERE 1=1
    `;

      const locationParams: any[] = [];

      if (filter.district_id) {
        locationQuery += ' AND sf.district_id = ?';
        locationParams.push(filter.district_id);
      }

      if (filter.ds_id) {
        locationQuery += ' AND sf.ds_id = ?';
        locationParams.push(filter.ds_id);
      }

      if (filter.zone_id) {
        locationQuery += ' AND sf.zone_id = ?';
        locationParams.push(filter.zone_id);
      }

      if (filter.gnd_id) {
        locationQuery += ' AND sf.gnd_id = ?';
        locationParams.push(filter.gnd_id);
      }

      if (filter.mainProgram) {
        locationQuery += ' AND sf.mainProgram = ?';
        locationParams.push(filter.mainProgram);
      }

      locationQuery += ' LIMIT 1';

      const locationResults = await this.entityManager.query(
        locationQuery,
        locationParams,
      );
      const locationResult = locationResults[0];

      if (locationResult) {
        location = {
          district: locationResult.district_id
            ? {
                district_id: locationResult.district_id,
                district_name: locationResult.district_name,
              }
            : undefined,
          ds: locationResult.ds_id
            ? {
                ds_id: locationResult.ds_id,
                ds_name: locationResult.ds_name,
              }
            : undefined,
          zone: locationResult.zone_id
            ? {
                zone_id: locationResult.zone_id,
                zone_name: locationResult.zone_name,
              }
            : undefined,
          gnd: locationResult.gnd_id
            ? {
                gnd_id: locationResult.gnd_id,
                gnd_name: locationResult.gnd_name,
              }
            : undefined,
        };
      }
    }

    return {
      counts: countResults.map((result) => ({
        empowerment_dimension_id: result.empowerment_dimension_id,
        nameEnglish: result.nameEnglish,
        nameSinhala: result.nameSinhala,
        nameTamil: result.nameTamil,
        count: parseInt(result.count),
      })),
      location,
    };
  }
}
 /*   
 
'2', '1-1-03-02-100', 'Aluthkade East/අලුත්කඩේ නැගෙනහිර/அலுத்த்கடே கிழக்கு', '1', '100' 
'1', '1-1-30-01-035', 'Galwala/ගල්වල/கல்வல', '1', '35' 
'3', '2-1-09-03-080', 'Hureegolla/හුරීගොල්ල/ஹுரீகொல்ல', '1', '80' 
'3', '2-1-36-03-415', 'Gannoruwa East/ගන්නෝරුව නැගෙනහිර/கன்னோறுவ கிழக்கு', '1', '415' 
'4', '5-1-18-04-180', 'Puliyanthivu West/පුලියන්තිවු බටහිර/புலியந்தீவு மேற்கு', '1', '180'
'1', '5-1-21-01-055', 'Nediyamadu/නැදියමඩු/நெடியமடு', '1', '55' 
'1', '1-2-33-01-450', 'Enderamulla West/එඬේරමුල්ල බටහිර/எண்டெரமுல்ல மேற்கு', '1', '450' 
'3', '1-2-03-03-070', 'Kudapaduwa South/කුඩපාඩුව දකුණ/குடபாடுவா தெற்கு', '1', '70' 
'4', '3-1-45-04-085', 'Ihalagoda West/ඉහලගොඩ බටහිර/இஹலகொட மேற்கு', '1', '85' 
'2', '3-1-33-02-105', 'Kondagala/කොන්ඩගල/கொண்டகல', '1', '105'



'3', '1-1-03-02', 'Central Colombo-2/මධ්‍යම කොළඹ-2/மத்திய கொழும்பு-2', 1, 2
'30', '1-1-30-01', 'Dehiwala/දෙහිවල/தேஹிவல', 1, 1
'30', '2-1-09-03', 'Dodangolla/දොඩංගොල්ල/தொடங்கொல்லா', 1, 3
'30', '2-1-36-03', 'Gannoruwa/ගන්නෝරුව/கன்னோறுவா', 1, 3

 
 */