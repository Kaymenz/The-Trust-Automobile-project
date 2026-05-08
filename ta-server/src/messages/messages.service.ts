import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger(MessagesService.name);

  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findByUserId(userId: string): Promise<Message[]> {
    try {
      this.logger.debug(`Fetching messages for user: ${userId}`);

      const messages = await this.messageModel
        .find({
          $or: [{ senderId: userId }, { recipientId: userId }],
        })
        .sort({ createdAt: -1 })
        .exec();

      this.logger.debug(`Found ${messages.length} messages for user ${userId}`);
      return messages;
    } catch (error) {
      this.logger.error(
        `Error fetching messages for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  async create(
    createMessageDto: CreateMessageDto,
    senderId: string,
    senderName: string,
    senderEmail: string,
  ): Promise<Message> {
    try {
      // Validate message content
      if (!createMessageDto.content || createMessageDto.content.trim() === '') {
        throw new BadRequestException('Message content is required');
      }

      if (createMessageDto.content.length > 10000) {
        throw new BadRequestException(
          'Message content cannot exceed 10000 characters'
        );
      }

      this.logger.debug(
        `Creating message from user ${senderId}:`,
        createMessageDto
      );

      const message = new this.messageModel({
        ...createMessageDto,
        senderId,
        senderName,
        senderEmail,
        type: createMessageDto.type || 'General',
        read: false,
      });

      const savedMessage = await message.save();
      this.logger.log(`Message created successfully: ${savedMessage._id}`);

      return savedMessage;
    } catch (error) {
      this.logger.error(`Error creating message from user ${senderId}:`, error);
      throw error;
    }
  }

  async findById(id: string): Promise<Message> {
    try {
      const message = await this.messageModel.findById(id).exec();

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      return message;
    } catch (error) {
      this.logger.error(`Error fetching message ${id}:`, error);
      throw error;
    }
  }

  async markAsRead(id: string): Promise<Message> {
    try {
      this.logger.debug(`Marking message ${id} as read`);

      const message = await this.messageModel
        .findByIdAndUpdate(id, { read: true }, { new: true })
        .exec();

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      this.logger.log(`Message ${id} marked as read`);
      return message;
    } catch (error) {
      this.logger.error(`Error marking message ${id} as read:`, error);
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      this.logger.debug(`Getting unread message count for user: ${userId}`);

      const count = await this.messageModel
        .countDocuments({
          recipientId: userId,
          read: false,
        })
        .exec();

      this.logger.debug(`User ${userId} has ${count} unread messages`);
      return count;
    } catch (error) {
      this.logger.error(
        `Error getting unread count for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    try {
      this.logger.debug(`Fetching conversation between ${userId1} and ${userId2}`);

      const messages = await this.messageModel
        .find({
          $or: [
            { senderId: userId1, recipientId: userId2 },
            { senderId: userId2, recipientId: userId1 },
          ],
        })
        .sort({ createdAt: 1 })
        .exec();

      this.logger.debug(
        `Found ${messages.length} messages in conversation`
      );
      return messages;
    } catch (error) {
      this.logger.error(
        `Error fetching conversation between ${userId1} and ${userId2}:`,
        error
      );
      throw error;
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      this.logger.debug(`Deleting message ${id}`);

      const result = await this.messageModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException('Message not found');
      }

      this.logger.log(`Message ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting message ${id}:`, error);
      throw error;
    }
  }

  async searchMessages(userId: string, query: string): Promise<Message[]> {
    try {
      this.logger.debug(
        `Searching messages for user ${userId} with query: ${query}`
      );

      const messages = await this.messageModel
        .find({
          $or: [{ senderId: userId }, { recipientId: userId }],
          content: { $regex: query, $options: 'i' },
        })
        .sort({ createdAt: -1 })
        .exec();

      this.logger.debug(
        `Found ${messages.length} messages matching query "${query}"`
      );
      return messages;
    } catch (error) {
      this.logger.error(
        `Error searching messages for user ${userId}:`,
        error
      );
      throw error;
    }
  }
}
