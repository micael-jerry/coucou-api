import { Module } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { AppController } from 'src/controller/app.controller';

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
