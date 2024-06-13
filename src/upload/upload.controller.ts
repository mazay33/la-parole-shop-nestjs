import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @Post('photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      path: file.path,
    };
  }
}
