-- CreateIndex
CREATE INDEX `Message_sentAt_idx` ON `Message`(`sentAt`);

-- CreateIndex
CREATE INDEX `User_email_idx` ON `User`(`email`);

-- CreateIndex
CREATE INDEX `User_googleId_idx` ON `User`(`googleId`);

-- RenameIndex
ALTER TABLE `message` RENAME INDEX `Message_chatId_fkey` TO `Message_chatId_idx`;

-- RenameIndex
ALTER TABLE `message` RENAME INDEX `Message_senderId_fkey` TO `Message_senderId_idx`;
