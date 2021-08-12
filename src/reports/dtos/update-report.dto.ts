import { IsBoolean } from 'class-validator';

export class UpdateReportDto {
  @IsBoolean()
  approved: boolean;
}
