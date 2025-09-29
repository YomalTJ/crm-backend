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
import { GrantUtilizationFilterDto } from './dto/grant-utilization-filter.dto';
import { GrantUtilizationResponseDto } from './dto/grant-utilization-response.dto';
import { BeneficiaryDetailsFilterDto } from './dto/beneficiary-details-filter.dto';
import { BeneficiaryDetailsResponseDto } from './dto/beneficiary-details-response.dto';

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

      -- Employment Facilitation
      jf.job_field_id as job_field_id,
      jf.nameEnglish as employment_facilitation_english_name,
      jf.nameSinhala as employment_facilitation_sinhala_name,
      jf.nameTamil as employment_facilitation_tamil_name,
      
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
    LEFT JOIN job_field jf ON sf.job_field_id = jf.job_field_id
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

      employmentFacilitation: result.job_field_id
        ? {
            id: result.job_field_id,
            english_name: result.employment_facilitation_english_name,
            sinhala_name: result.employment_facilitation_sinhala_name,
            tamil_name: result.employment_facilitation_tamil_name,
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

  async getGrantUtilization(
    filter: GrantUtilizationFilterDto,
  ): Promise<GrantUtilizationResponseDto> {
    let query = `
  SELECT 
    COUNT(CASE WHEN u.financialAid IS NOT NULL THEN 1 END) as financial_aid_count,
    COALESCE(SUM(CAST(u.financialAid AS DECIMAL(18,2))), 0) as financial_aid_total,

    COUNT(CASE WHEN u.interestSubsidizedLoan IS NOT NULL THEN 1 END) as interest_loan_count,
    COALESCE(SUM(CAST(u.interestSubsidizedLoan AS DECIMAL(18,2))), 0) as interest_loan_total,

    COUNT(CASE WHEN u.samurdiBankLoan IS NOT NULL THEN 1 END) as samurdi_loan_count,
    COALESCE(SUM(CAST(u.samurdiBankLoan AS DECIMAL(18,2))), 0) as samurdi_loan_total,

    COUNT(u.id) as total_projects,
    COALESCE(SUM(CAST(
      COALESCE(u.financialAid, 0) + 
      COALESCE(u.interestSubsidizedLoan, 0) + 
      COALESCE(u.samurdiBankLoan, 0)
    AS DECIMAL(18,2))), 0) as total_amount

  FROM grant_utilization u
  LEFT JOIN samurdhi_family sf ON 
  (sf.aswasumaHouseholdNo = u.hhNumber_or_nic OR sf.nic = u.hhNumber_or_nic)
  LEFT JOIN districts d ON sf.district_id = d.district_id
  LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
  LEFT JOIN zone z ON sf.zone_id = z.zone_id
  LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
  LEFT JOIN beneficiary_status bs ON sf.beneficiary_type_id = bs.beneficiary_type_id
  WHERE (u.financialAid IS NOT NULL OR u.interestSubsidizedLoan IS NOT NULL OR u.samurdiBankLoan IS NOT NULL)
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

    if (filter.beneficiary_type_id) {
      query += ' AND sf.beneficiary_type_id = ?';
      paramValues.push(filter.beneficiary_type_id);
    }

    const results = await this.entityManager.query(query, paramValues);
    const result = results[0];

    // Get location information if location filters were applied
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

      if (filter.beneficiary_type_id) {
        locationQuery += ' AND sf.beneficiary_type_id = ?';
        locationParams.push(filter.beneficiary_type_id);
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
      location,
      financialAid: {
        totalProjects: parseInt(result.financial_aid_count) || 0,
        totalAmount: parseFloat(result.financial_aid_total) || 0,
      },
      interestSubsidizedLoan: {
        totalProjects: parseInt(result.interest_loan_count) || 0,
        totalAmount: parseFloat(result.interest_loan_total) || 0,
      },
      samurdiBankLoan: {
        totalProjects: parseInt(result.samurdi_loan_count) || 0,
        totalAmount: parseFloat(result.samurdi_loan_total) || 0,
      },
      overallTotal: {
        totalProjects: parseInt(result.total_projects) || 0,
        totalAmount: parseFloat(result.total_amount) || 0,
      },
    };
  }

  private safeParseJson(jsonString: any): any {
    if (!jsonString) {
      return undefined;
    }

    // If it's already an object/array, return it
    if (typeof jsonString === 'object') {
      return jsonString;
    }

    // If it's a string, try to parse it
    if (typeof jsonString === 'string') {
      try {
        // Trim the string and check if it's valid JSON
        const trimmed = jsonString.trim();
        if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
          return undefined;
        }
        return JSON.parse(trimmed);
      } catch (error) {
        console.warn(
          'Failed to parse JSON, returning raw string:',
          jsonString,
          error,
        );
        // Return the original string if parsing fails
        return jsonString;
      }
    }

    return undefined;
  }

  private async getRelatedNames(
    ids: string[],
    tableName: string,
    idColumn: string,
  ): Promise<any[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const placeholders = ids.map(() => '?').join(',');
    const query = `
    SELECT 
      ${idColumn} as id,
      nameEnglish,
      nameSinhala,
      nameTamil
    FROM ${tableName}
    WHERE ${idColumn} IN (${placeholders})
  `;

    const results = await this.entityManager.query(query, ids);
    return results.map((r) => ({
      id: r.id,
      nameEnglish: r.nameEnglish,
      nameSinhala: r.nameSinhala,
      nameTamil: r.nameTamil,
    }));
  }

  async getBeneficiaryDetails(
    filter: BeneficiaryDetailsFilterDto,
  ): Promise<BeneficiaryDetailsResponseDto[]> {
    let query = `
    SELECT 
      sf.id as id,
      sf.aswasumaHouseholdNo as aswasumaHouseholdNo,
      sf.nic as nic,
      sf.beneficiaryName as beneficiaryName,
      sf.beneficiaryAge as beneficiaryAge,
      sf.beneficiaryGender as beneficiaryGender,
      sf.address as address,
      sf.mobilePhone as mobilePhone,
      sf.telephone as telephone,
      sf.projectOwnerName as projectOwnerName,
      sf.projectOwnerAge as projectOwnerAge,
      sf.projectOwnerGender as projectOwnerGender,
      sf.hasDisability as hasDisability,
      sf.hasConsentedToEmpowerment as hasConsentedToEmpowerment,
      sf.isImpactEvaluation as isImpactEvaluation,
      sf.consentGivenAt as consentGivenAt,
      sf.mainProgram as mainProgram,
      sf.areaClassification as areaClassification,
      sf.monthlySaving as monthlySaving,
      sf.savingAmount as savingAmount,
      sf.hasOtherGovernmentSubsidy as hasOtherGovernmentSubsidy,
      sf.otherGovernmentInstitution as otherGovernmentInstitution,
      sf.otherSubsidyAmount as otherSubsidyAmount,
      sf.createdAt as createdAt,
      
      -- Demographics
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
      
      -- Additional fields
      sf.otherOccupation as otherOccupation,
      sf.otherProject as otherProject,
      sf.otherJobField as otherJobField,
      sf.resource_id as resource_id,
      sf.health_indicator_id as health_indicator_id,
      sf.domestic_dynamic_id as domestic_dynamic_id,
      sf.community_participation_id as community_participation_id,
      sf.housing_service_id as housing_service_id,
      
      -- Child Details
      sf.childName as childName,
      sf.childAge as childAge,
      sf.childGender as childGender,
      
      -- Bank Details
      sf.commercialBankAccountName as commercialBankAccountName,
      sf.commercialBankAccountNumber as commercialBankAccountNumber,
      sf.commercialBankName as commercialBankName,
      sf.commercialBankBranch as commercialBankBranch,
      sf.samurdhiBankAccountName as samurdhiBankAccountName,
      sf.samurdhiBankAccountNumber as samurdhiBankAccountNumber,
      sf.samurdhiBankName as samurdhiBankName,
      sf.samurdhiBankAccountType as samurdhiBankAccountType,
      sf.wantsAswesumaBankTransfer as wantsAswesumaBankTransfer,
      sf.otherBankName as otherBankName,
      sf.otherBankBranch as otherBankBranch,
      sf.otherBankAccountHolder as otherBankAccountHolder,
      sf.otherBankAccountNumber as otherBankAccountNumber,

      -- Location
      d.district_id as district_id,
      d.district_name as district_name,
      ds.ds_id as ds_id,
      ds.ds_name as ds_name,
      z.zone_id as zone_id,
      z.zone_name as zone_name,
      g.gnd_id as gnd_id,
      g.gnd_name as gnd_name,

      -- Beneficiary Type
      bs.beneficiary_type_id as beneficiary_type_id,
      bs.nameEnglish as beneficiary_name_english,
      bs.nameSinhala as beneficiary_name_sinhala,
      bs.nameTamil as beneficiary_name_tamil,

      -- Disability
      dis.disability_id as disability_id,
      dis.name_en as disability_name_en,
      dis.name_si as disability_name_si,
      dis.name_ta as disability_name_ta,

      -- Current Employment
      ce.employment_id as employment_id,
      ce.nameEnglish as employment_name_english,
      ce.nameSinhala as employment_name_sinhala,
      ce.nameTamil as employment_name_tamil,

      -- Samurdhi Subsidy
      ss.subsisdy_id as subsisdy_id,
      ss.amount as subsidy_amount,

      -- Aswasuma Category
      ac.aswesuma_cat_id as aswesuma_cat_id,
      ac.nameEnglish as aswasuma_name_english,
      ac.nameSinhala as aswasuma_name_sinhala,
      ac.nameTamil as aswasuma_name_tamil,

      -- Empowerment Dimension
      ed.empowerment_dimension_id as empowerment_dimension_id,
      ed.nameEnglish as empowerment_name_english,
      ed.nameSinhala as empowerment_name_sinhala,
      ed.nameTamil as empowerment_name_tamil,

      -- Refusal Reason
      err.id as refusal_reason_id,
      err.reason_si as refusal_reason_si,
      err.reason_en as refusal_reason_en,
      err.reason_ta as refusal_reason_ta,

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

      -- Job Field
      jf.job_field_id as job_field_id,
      jf.nameEnglish as job_field_name_english,
      jf.nameSinhala as job_field_name_sinhala,
      jf.nameTamil as job_field_name_tamil,

      -- Created By Staff
      s.id as staff_id,
      s.name as staffName,
      ur.name as role_name

    FROM samurdhi_family sf
    LEFT JOIN districts d ON sf.district_id = d.district_id
    LEFT JOIN ds ds ON sf.ds_id = ds.ds_id
    LEFT JOIN zone z ON sf.zone_id = z.zone_id
    LEFT JOIN gnd g ON sf.gnd_id = g.gnd_id
    LEFT JOIN beneficiary_status bs ON sf.beneficiary_type_id = bs.beneficiary_type_id
    LEFT JOIN disability dis ON sf.disability_id = dis.disability_id
    LEFT JOIN current_employment ce ON sf.employment_id = ce.employment_id
    LEFT JOIN samurdhi_subsisdy ss ON sf.subsisdy_id = ss.subsisdy_id
    LEFT JOIN aswasuma_category ac ON sf.aswesuma_cat_id = ac.aswesuma_cat_id
    LEFT JOIN empowerment_dimension ed ON sf.empowerment_dimension_id = ed.empowerment_dimension_id
    LEFT JOIN empowerment_refusal_reasons err ON sf.refusal_reason_id = err.id
    LEFT JOIN livelihoods l ON sf.livelihood_id = l.id
    LEFT JOIN project_type pt ON sf.project_type_id = pt.project_type_id
    LEFT JOIN job_field jf ON sf.job_field_id = jf.job_field_id
    LEFT JOIN staff s ON sf.created_by = s.id
    LEFT JOIN user_role ur ON s.roleId = ur.id
    WHERE 1=1
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

    if (filter.empowerment_dimension_id) {
      query += ' AND sf.empowerment_dimension_id = ?';
      paramValues.push(filter.empowerment_dimension_id);
    }

    query += ' ORDER BY sf.createdAt DESC';

    const results = await this.entityManager.query(query, paramValues);

    return Promise.all(
      results.map(async (result) => {
        // Parse the JSON arrays
        const resourceIds = this.safeParseJson(result.resource_id) || [];
        const healthIndicatorIds =
          this.safeParseJson(result.health_indicator_id) || [];
        const domesticDynamicIds =
          this.safeParseJson(result.domestic_dynamic_id) || [];
        const communityParticipationIds =
          this.safeParseJson(result.community_participation_id) || [];
        const housingServiceIds =
          this.safeParseJson(result.housing_service_id) || [];

        // Fetch related names
        const [
          resources,
          healthIndicators,
          domesticDynamics,
          communityParticipations,
          housingServices,
        ] = await Promise.all([
          Array.isArray(resourceIds) && resourceIds.length > 0
            ? this.getRelatedNames(
                resourceIds,
                'resource_needed',
                'resource_id',
              )
            : [],
          Array.isArray(healthIndicatorIds) && healthIndicatorIds.length > 0
            ? this.getRelatedNames(
                healthIndicatorIds,
                'health_indicator',
                'health_indicator_id',
              )
            : [],
          Array.isArray(domesticDynamicIds) && domesticDynamicIds.length > 0
            ? this.getRelatedNames(
                domesticDynamicIds,
                'domestic_dynamic',
                'domestic_dynamic_id',
              )
            : [],
          Array.isArray(communityParticipationIds) &&
          communityParticipationIds.length > 0
            ? this.getRelatedNames(
                communityParticipationIds,
                'community_participation',
                'community_participation_id',
              )
            : [],
          Array.isArray(housingServiceIds) && housingServiceIds.length > 0
            ? this.getRelatedNames(
                housingServiceIds,
                'housing_basic_service',
                'housing_service_id',
              )
            : [],
        ]);

        return {
          id: result.id,
          aswasumaHouseholdNo: result.aswasumaHouseholdNo,
          nic: result.nic,
          beneficiaryName: result.beneficiaryName,
          beneficiaryAge: result.beneficiaryAge,
          beneficiaryGender: result.beneficiaryGender,
          address: result.address,
          mobilePhone: result.mobilePhone,
          telephone: result.telephone,
          projectOwnerName: result.projectOwnerName,
          projectOwnerAge: result.projectOwnerAge,
          projectOwnerGender: result.projectOwnerGender,
          hasDisability: result.hasDisability,
          hasConsentedToEmpowerment: result.hasConsentedToEmpowerment,
          isImpactEvaluation: result.isImpactEvaluation,
          consentGivenAt: result.consentGivenAt,
          mainProgram: result.mainProgram,
          areaClassification: result.areaClassification,
          monthlySaving: result.monthlySaving,
          savingAmount: result.savingAmount,
          hasOtherGovernmentSubsidy: result.hasOtherGovernmentSubsidy,
          otherGovernmentInstitution: result.otherGovernmentInstitution,
          otherSubsidyAmount: result.otherSubsidyAmount,
          createdAt: result.createdAt,

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

          demographics: {
            totalFamilyMembers:
              result.maleBelow16 +
              result.femaleBelow16 +
              result.male16To24 +
              result.female16To24 +
              result.male25To45 +
              result.female25To45 +
              result.male46To60 +
              result.female46To60 +
              result.maleAbove60 +
              result.femaleAbove60,
            totalMale:
              result.maleBelow16 +
              result.male16To24 +
              result.male25To45 +
              result.male46To60 +
              result.maleAbove60,
            totalFemale:
              result.femaleBelow16 +
              result.female16To24 +
              result.female25To45 +
              result.female46To60 +
              result.femaleAbove60,
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

          disability: result.disability_id
            ? {
                disability_id: result.disability_id,
                nameEN: result.disability_name_en,
                nameSi: result.disability_name_si,
                nameTa: result.disability_name_ta,
              }
            : undefined,

          currentEmployment: result.employment_id
            ? {
                employment_id: result.employment_id,
                nameEnglish: result.employment_name_english,
                nameSinhala: result.employment_name_sinhala,
                nameTamil: result.employment_name_tamil,
              }
            : undefined,

          samurdhiSubsidy: result.subsisdy_id
            ? {
                subsisdy_id: result.subsisdy_id,
                amount: result.subsidy_amount,
              }
            : undefined,

          aswasumaCategory: result.aswesuma_cat_id
            ? {
                aswesuma_cat_id: result.aswesuma_cat_id,
                nameEnglish: result.aswasuma_name_english,
                nameSinhala: result.aswasuma_name_sinhala,
                nameTamil: result.aswasuma_name_tamil,
              }
            : undefined,

          empowermentDimension: result.empowerment_dimension_id
            ? {
                empowerment_dimension_id: result.empowerment_dimension_id,
                nameEnglish: result.empowerment_name_english,
                nameSinhala: result.empowerment_name_sinhala,
                nameTamil: result.empowerment_name_tamil,
              }
            : undefined,

          refusalReason: result.refusal_reason_id
            ? {
                id: result.refusal_reason_id,
                reason_si: result.refusal_reason_si,
                reason_en: result.refusal_reason_en,
                reason_ta: result.refusal_reason_ta,
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

          jobField: result.job_field_id
            ? {
                job_field_id: result.job_field_id,
                nameEnglish: result.job_field_name_english,
                nameSinhala: result.job_field_name_sinhala,
                nameTamil: result.job_field_name_tamil,
              }
            : undefined,

          bankDetails: {
            commercial:
              result.commercialBankAccountName ||
              result.commercialBankAccountNumber ||
              result.commercialBankName ||
              result.commercialBankBranch
                ? {
                    accountName: result.commercialBankAccountName,
                    accountNumber: result.commercialBankAccountNumber,
                    bankName: result.commercialBankName,
                    branch: result.commercialBankBranch,
                  }
                : undefined,
            samurdhi:
              result.samurdhiBankAccountName ||
              result.samurdhiBankAccountNumber ||
              result.samurdhiBankName ||
              result.samurdhiBankAccountType
                ? {
                    accountName: result.samurdhiBankAccountName,
                    accountNumber: result.samurdhiBankAccountNumber,
                    bankName: result.samurdhiBankName,
                    accountType: result.samurdhiBankAccountType,
                  }
                : undefined,
            other:
              result.otherBankName ||
              result.otherBankBranch ||
              result.otherBankAccountHolder ||
              result.otherBankAccountNumber
                ? {
                    bankName: result.otherBankName,
                    branch: result.otherBankBranch,
                    accountHolder: result.otherBankAccountHolder,
                    accountNumber: result.otherBankAccountNumber,
                  }
                : undefined,
            wantsAswesumaBankTransfer: result.wantsAswesumaBankTransfer,
          },

          childDetails:
            result.childName || result.childAge || result.childGender
              ? {
                  childName: result.childName,
                  childAge: result.childAge,
                  childGender: result.childGender,
                }
              : undefined,

          otherOccupation: result.otherOccupation,
          otherProject: result.otherProject,
          otherJobField: result.otherJobField,

          resources: resources.length > 0 ? resources : undefined,
          healthIndicators:
            healthIndicators.length > 0 ? healthIndicators : undefined,
          domesticDynamics:
            domesticDynamics.length > 0 ? domesticDynamics : undefined,
          communityParticipations:
            communityParticipations.length > 0
              ? communityParticipations
              : undefined,
          housingServices:
            housingServices.length > 0 ? housingServices : undefined,

          createdBy: result.staff_id
            ? {
                staff_id: result.staff_id,
                staffName: result.staffName,
                role: result.role_name,
              }
            : undefined,
        };
      }),
    );
  }
}
