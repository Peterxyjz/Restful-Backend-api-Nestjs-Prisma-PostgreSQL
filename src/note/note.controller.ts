import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { GetUser } from '../auth/decorator';
import { InsertNoteDTO, UpdateNoteDTO } from './dto';
@UseGuards(MyJwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private noteService: NoteService) {}
  @Get()
  getNotes(@GetUser('id') userId: number) {
    return this.noteService.getNotes(userId);
  }

  @Get(':id')
  getNoteById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) noteId: number,
  ) {
    return this.noteService.getNoteById(userId, noteId);
  }

  @Post()
  createNote(
    @GetUser('id') userId: number,
    @Body() insertNoteDTO: InsertNoteDTO,
  ) {
    console.log(
      `userId: ${userId}, insertNoteDTO: ${JSON.stringify(insertNoteDTO)}`,
    );

    return this.noteService.createNote(userId, insertNoteDTO);
  }

  @Patch(':id')
  updateNote(
    @GetUser('id', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) noteId: number,
    @Body() updateNote: UpdateNoteDTO,
  ) {
    return this.noteService.updateNote(userId, noteId, updateNote);
  }

  @Delete()
  deleteNoteById(
    @GetUser('id', ParseIntPipe) userId: number,
    @Query('id', ParseIntPipe) noteId: number,
  ) {
    return this.noteService.deleteNoteById(userId, noteId);
  }
}
