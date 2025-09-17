import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthMiddleware } from './middleware/jwt-auth.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MemberModule } from './member/member.module';
import { Member } from './member/entities/member.entity';
import { StaffModule } from './staff/staff.module';
import { UserRoleModule } from './user-role/user-role.module';
import { ModuleModule } from './module/module.module';
import { Staff } from './staff/entities/staff.entity';
import { UserRole } from './user-role/entities/user-role.entity';
import { SystemModules } from './module/entities/module.entity';
import { AppKeyMiddleware } from './middleware/app-key.middleware';
import { BlacklistedToken } from './auth/entities/blacklisted-token.entity';
import { TokenCleanupController } from './utils/token-cleanup.controller';
import { TokenCleanupModule } from './utils/token-cleanup.module';
import { SamurdhiFamilyModule } from './samurdhi-family/samurdhi-family.module';
import { SamurdhiFamily } from './samurdhi-family/entities/samurdhi-family.entity';
import { LocationModule } from './location/location.module';
import { Province } from './location/entities/province.entity';
import { District } from './location/entities/district.entity';
import { Ds } from './location/entities/ds.entity';
import { Zone } from './location/entities/zone.entity';
import { Gnd } from './location/entities/gnd.entity';
import { CurrentEmploymentModule } from './current-employment/current-employment.module';
import { AuditModule } from './audit/audit.module';
import { CurrentEmployment } from './current-employment/entities/current-employment.entity';
import { AuditLog } from './audit/entities/audit-log.entity';
import { SamurdhiSubsidyModule } from './samurdhi-subsidy/samurdhi-subsidy.module';
import { SamurdhiSubsisdy } from './samurdhi-subsidy/entities/samurdhi-subsidy.entity';
import { AswasumaCategoryModule } from './aswasuma-category/aswasuma-category.module';
import { AswasumaCategory } from './aswasuma-category/entities/aswasuma-category.entity';
import { ProjectTypeModule } from './project-type/project-type.module';
import { ProjectType } from './project-type/entities/project-type.entity';
import { JobFieldModule } from './job-field/job-field.module';
import { JobField } from './job-field/entities/job-field.entity';
import { ResourceNeededModule } from './resource-needed/resource-needed.module';
import { ResourceNeeded } from './resource-needed/entities/resource-needed.entity';
import { HealthIndicatorsModule } from './health-indicators/health-indicators.module';
import { HealthIndicator } from './health-indicators/entities/health-indicator.entity';
import { DomesticDynamicsModule } from './domestic-dynamics/domestic-dynamics.module';
import { DomesticDynamic } from './domestic-dynamics/entities/domestic-dynamic.entity';
import { CommunityParticipationModule } from './community-participation/community-participation.module';
import { CommunityParticipation } from './community-participation/entities/community-participation.entity';
import { HousingBasicServicesModule } from './housing-basic-services/housing-basic-services.module';
import { HousingBasicService } from './housing-basic-services/entities/housing-basic-service.entity';
import { BeneficiaryStatusModule } from './beneficiary-status/beneficiary-status.module';
import { BeneficiaryStatus } from './beneficiary-status/entities/beneficiary-status.entity';
import { EmpowermentDimensionModule } from './empowerment-dimension/empowerment-dimension.module';
import { EmpowermentDimension } from './empowerment-dimension/entities/empowerment-dimension.entity';
import { HouseholdCitizenModule } from './household-citizen/household-citizen.module';
import { Household } from './household-citizen/entities/household.entity';
import { Citizen } from './household-citizen/entities/citizen.entity';
import { RolesGuard } from './auth/guards/roles.guard';
import { EmpowermentRefusalReason } from './empowerment-refusal-reason/entities/empowerment-refusal-reason.entity';
import { Disability } from './disability/entities/disability.entity';
import { EmpowermentRefusalReasonModule } from './empowerment-refusal-reason/empowerment-refusal-reason.module';
import { DisabilityModule } from './disability/disability.module';
import { GrantUtilizationModule } from './grant-utilization/grant-utilization.module';
import { GrantUtilization } from './grant-utilization/entities/grant-utilization.entity';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { LivelihoodsModule } from './livelihoods/livelihoods.module';
import { Livelihood } from './livelihoods/entities/livelihood.entity';
import { BusinessEmpowermentModule } from './business-empowerment/business-empowerment.module';
import { BusinessEmpowerment } from './business-empowerment/entities/business-empowerment.entity';
import { CourseModule } from './course/course.module';
import { Course } from './course/entities/course.entity';
import { BeneficiaryTrainingModule } from './beneficiary-training/beneficiary-training.module';
import { BeneficiaryTraining } from './beneficiary-training/entities/beneficiary-training.entity';
import { BeneficiaryService } from './beneficiary/beneficiary.service';
import { BeneficiaryController } from './beneficiary/beneficiary.controller';
import { BeneficiaryModule } from './beneficiary/beneficiary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [
          User,
          BlacklistedToken,
          Member,
          Staff,
          UserRole,
          SystemModules,
          SamurdhiFamily,
          Province,
          District,
          Ds,
          Zone,
          Gnd,
          CurrentEmployment,
          AuditLog,
          SamurdhiSubsisdy,
          AswasumaCategory,
          ProjectType,
          JobField,
          ResourceNeeded,
          HealthIndicator,
          DomesticDynamic,
          CommunityParticipation,
          HousingBasicService,
          BeneficiaryStatus,
          EmpowermentDimension,
          Household,
          Citizen,
          EmpowermentRefusalReason,
          Disability,
          GrantUtilization,
          Livelihood,
          BusinessEmpowerment,
          Course,
          BeneficiaryTraining,
        ],
        synchronize: config.get('NODE_ENV') === 'development',
        migrationsRun: config.get('NODE_ENV') === 'production',
      }),
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/consent-letters',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new Error('Only PDF files are allowed'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    MemberModule,
    StaffModule,
    UserRoleModule,
    ModuleModule,
    TokenCleanupModule,
    SamurdhiFamilyModule,
    LocationModule,
    CurrentEmploymentModule,
    AuditModule,
    SamurdhiSubsidyModule,
    AswasumaCategoryModule,
    ProjectTypeModule,
    JobFieldModule,
    ResourceNeededModule,
    HealthIndicatorsModule,
    DomesticDynamicsModule,
    CommunityParticipationModule,
    HousingBasicServicesModule,
    BeneficiaryStatusModule,
    EmpowermentDimensionModule,
    HouseholdCitizenModule,
    EmpowermentRefusalReasonModule,
    DisabilityModule,
    GrantUtilizationModule,
    LivelihoodsModule,
    BusinessEmpowermentModule,
    CourseModule,
    BeneficiaryTrainingModule,
    BeneficiaryModule,
  ],
  controllers: [AppController, TokenCleanupController, BeneficiaryController],
  providers: [AppService, JwtAuthMiddleware, RolesGuard, BeneficiaryService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppKeyMiddleware)
      .forRoutes(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/logout', method: RequestMethod.POST },
        { path: 'staff/login', method: RequestMethod.POST },
        { path: 'staff/logout', method: RequestMethod.POST },
      );

    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'member', method: RequestMethod.ALL },
        { path: 'staff', method: RequestMethod.ALL },
        { path: 'module', method: RequestMethod.ALL },
        { path: 'user-role', method: RequestMethod.ALL },
        { path: 'samurdhi-family', method: RequestMethod.ALL },
        { path: 'current-employment', method: RequestMethod.ALL },
        { path: 'samurdhi-subsidy', method: RequestMethod.ALL },
        { path: 'aswasuma-category', method: RequestMethod.ALL },
        { path: 'project-type', method: RequestMethod.ALL },
        { path: 'job-field', method: RequestMethod.ALL },
        { path: 'resource-needed', method: RequestMethod.ALL },
        { path: 'health-indicators', method: RequestMethod.ALL },
        { path: 'domestic-dynamics', method: RequestMethod.ALL },
        { path: 'community-participation', method: RequestMethod.ALL },
        { path: 'housing-basic-services', method: RequestMethod.ALL },
        { path: 'beneficiary-status', method: RequestMethod.ALL },
        { path: 'empowerment-dimension', method: RequestMethod.ALL },
        { path: 'household-citizen', method: RequestMethod.ALL },
        { path: 'audit', method: RequestMethod.ALL },
        { path: 'empowerment-refusal-reason', method: RequestMethod.ALL },
        { path: 'disabilities', method: RequestMethod.ALL },
        { path: 'grant-utilization', method: RequestMethod.ALL },
        { path: 'livelihoods', method: RequestMethod.ALL },
        { path: 'business-empowerment', method: RequestMethod.ALL },
        { path: 'course', method: RequestMethod.ALL },
        { path: 'beneficiaries', method: RequestMethod.ALL },
      );
  }
}
