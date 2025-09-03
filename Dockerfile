FROM node:20-slim

WORKDIR /app

# ติดตั้ง dependencies ที่ Chromium ต้องใช้
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    libgbm1 \
    ca-certificates \
    fonts-liberation \
    fonts-thai-tlwg \        
    fonts-noto-cjk \       
    libappindicator1 \
    lsb-release \
    xdg-utils \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# copy package.json
COPY package*.json ./

# copy ฟอนต์เข้า container
COPY fonts /usr/share/fonts/truetype/custom

# refresh font cache
RUN fc-cache -f -v


RUN npm install

# copy source code ทั้งหมด
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
