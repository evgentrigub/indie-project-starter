import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

let dataSource: DataSource;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  dataSource = moduleRef.get<DataSource>(DataSource);
});

afterAll(async () => {
  if (dataSource) {
    await dataSource.destroy();
  }
}); 