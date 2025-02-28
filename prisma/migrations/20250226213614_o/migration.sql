-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "broadcaster" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tipoGara" TEXT NOT NULL,
    "nomeCampionato" TEXT NOT NULL DEFAULT '',
    "nomePL1" TEXT NOT NULL,
    "recordPL1" TEXT NOT NULL,
    "cittaPL1" TEXT NOT NULL,
    "nazionalitaPL1" TEXT NOT NULL,
    "svgPL1" TEXT NOT NULL,
    "etàPL1" TEXT NOT NULL,
    "pesoPL1" TEXT NOT NULL,
    "altezzaPL1" TEXT NOT NULL,
    "fotoPL1" TEXT NOT NULL DEFAULT '',
    "nomePL2" TEXT NOT NULL,
    "recordPL2" TEXT NOT NULL,
    "cittaPL2" TEXT NOT NULL,
    "nazionalitaPL2" TEXT NOT NULL,
    "svgPL2" TEXT NOT NULL,
    "etàPL2" TEXT NOT NULL,
    "pesoPL2" TEXT NOT NULL,
    "altezzaPL2" TEXT NOT NULL,
    "fotoPL2" TEXT NOT NULL DEFAULT '',
    "eventDayId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Match_eventDayId_fkey" FOREIGN KEY ("eventDayId") REFERENCES "EventDay" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Match_name_key" ON "Match"("name");
