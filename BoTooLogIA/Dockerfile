# BoTooLogIA — App Next.js (pour connexion BDD via réseau Docker)
FROM node:20-alpine
WORKDIR /app
# Pas de package-lock pour éviter les deps Windows (rollup-win32) ; npm résout pour Linux
COPY package.json ./
RUN npm install --omit=optional
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
