import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  _id: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439012', description: 'Sender user ID' })
  senderId: string;

  @ApiProperty({ example: 'John Doe', description: 'Sender name' })
  senderName: string;

  @ApiProperty({ example: 'john@example.com', description: 'Sender email' })
  senderEmail: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439013', description: 'Recipient user ID', required: false })
  recipientId?: string;

  @ApiProperty({ example: 'Hello, I am interested in your car listing.', description: 'Message content' })
  content: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439014', description: 'Related listing ID', required: false })
  relatedListingId?: string;

  @ApiProperty({
    example: 'Inquiry',
    description: 'Message type',
    enum: ['Inquiry', 'Follow-up', 'General'],
  })
  type: string;

  @ApiProperty({ example: false, description: 'Whether the message has been read' })
  read: boolean;

  @ApiProperty({ example: '2024-02-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-15T10:30:00.000Z' })
  updatedAt: Date;
}
