import { PrismaService } from './../prisma/prisma.service';
import {
  Delete,
  ForbiddenException,
  Get,
  Injectable,
  Patch,
  Post,
} from '@nestjs/common';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';

@Injectable()
export class NoteService {
  constructor(private prismaService: PrismaService) {}
  @Get()
  async getNotes(userId: number) {
    const notes = await this.prismaService.note.findMany({
      where: {
        userId,
      },
    });
    return { notes };
  }

  @Get(':id')
  async getNoteById(userId: number, noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
        userId: userId,
      },
    });
    return note;
  }

  @Post()
  async createNote(userId: number, insertNoteDTO: InsertNoteDTO) {
    const note = await this.prismaService.note.create({
      data: {
        ...insertNoteDTO,
        userId,
      },
    });
    return note;
  }

  @Patch()
  async updateNote(
    userId: number,
    noteId: number,
    updateNoteDTO: UpdateNoteDTO,
  ) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
        userId: userId,
      },
    });
    if (!note) {
      throw new ForbiddenException('Note not found');
    }
    return this.prismaService.note.update({
      where: {
        id: noteId,
      },
      data: {
        ...updateNoteDTO,
      },
    });
  }

  @Delete()
  async deleteNoteById(userId: number, noteId: number) {
    const note = await this.prismaService.note.findUnique({
      where: {
        id: noteId,
        userId: userId,
      },
    });
    if (!note) {
      throw new ForbiddenException('Note not found');
    }
    return this.prismaService.note.delete({
      where: {
        id: noteId,
      },
    });
  }
}
