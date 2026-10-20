<div align="center">

# 🎬 Movie Mobile

**Explore filmes de forma rápida e fluida, direto do seu celular.**

Aplicativo mobile construído com **React Native**, **Expo Router** e **NativeWind v4**.

<br />

![Expo](https://img.shields.io/badge/Expo-v51.0-000000?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)

<br />

[📲 Baixar APK](#-baixar-o-aplicativo) •
[🚀 Tecnologias](#-tecnologias-e-ferramentas) •
[📁 Estrutura](#-estrutura-do-projeto) •
[🛠️ Como executar](#️-como-executar-o-projeto) •
[🌿 Git Flow](#-git-flow)

</div>

---

## 📲 Baixar o aplicativo

Quer testar sem instalar nada no computador? Baixe o APK e instale direto no seu Android.

<div align="center">

[![Baixar APK](https://img.shields.io/badge/⬇️_Baixar_APK-Google_Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/1N5vpkgs7ZtJ4rfbVwQnz83k_blDuzHi4/view?usp=drive_link)

</div>

> [!NOTE]
> Para instalar, o Android pode pedir para **permitir a instalação de apps de fontes desconhecidas**. Isso acontece porque o APK não vem da Google Play Store.

---

## 📖 Sobre o projeto

O **Movie Mobile** utiliza uma arquitetura baseada em **rotas e layouts**, com foco em organização, reutilização de componentes e desenvolvimento multiplataforma.

---

## 🚀 Tecnologias e Ferramentas

| Tecnologia | Para que serve |
| --- | --- |
| **[React Native](https://reactnative.dev/)** | Desenvolvimento de aplicações mobile multiplataforma |
| **[Expo Router](https://docs.expo.dev/router/introduction/)** | Navegação baseada em arquivos (*file-based routing*) |
| **[NativeWind v4](https://www.nativewind.dev/)** | Estilização com Tailwind CSS no React Native |
| **[TypeScript](https://www.typescriptlang.org/)** | Tipagem estática para o JavaScript |
| **Metro Bundler** | Processa e empacota a aplicação no Expo/React Native |

---

## ✨ Funcionalidades Principais

- [x] 🧭 **Navegação por abas** — principais telas organizadas com `expo-router`
- [x] 🔗 **Rotas dinâmicas** — `[id].tsx` para acessar os detalhes de cada filme
- [x] 🎨 **NativeWind v4** — estilização com classes utilitárias via `className`
- [x] 🏗️ **Arquitetura baseada em layouts** — separação entre layout raiz e navegação por abas
- [x] 🧩 **Componentes reutilizáveis** — interface organizada para facilitar a manutenção

---

## 📁 Estrutura do Projeto

O diretório `src/app` é a raiz das rotas, seguindo a arquitetura baseada em arquivos do **Expo Router**.

```text
src/
├── app/
│   ├── (tabs)/                  # Grupo de rotas das abas inferiores
│   │   ├── _layout.tsx          # Configuração da navegação por abas
│   │   ├── index.tsx            # Tela principal (Home)
│   │   ├── search.tsx           # Tela de busca
│   │   ├── saved.tsx            # Filmes salvos / favoritos
│   │   └── profile.tsx          # Perfil do usuário
│   │
│   ├── movie/
│   │   └── [id].tsx             # Rota dinâmica para detalhes do filme
│   │
│   ├── _layout.tsx              # Layout raiz da aplicação
│   └── globals.css              # Estilos globais do NativeWind
│
├── assets/                      # Imagens, ícones e outros arquivos estáticos
├── components/                  # Componentes reutilizáveis
│
├── babel.config.js              # Configuração do Babel
├── metro.config.js              # Configuração do Metro Bundler
├── tailwind.config.js           # Configuração do Tailwind / NativeWind
└── nativewind-env.d.ts          # Declarações de tipos do NativeWind
```

---

## 🛠️ Como Executar o Projeto

### ✅ Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)
- [Expo Go](https://expo.dev/go/) (se for usar um dispositivo físico)
- Android Studio com um emulador Android (se for usar emulador)

### 1️⃣ Clone o repositório

Clone a branch `develop`:

```bash
git clone -b develop https://github.com/SEU-USUARIO/rn-build-app.git
```

Entre no diretório do projeto:

```bash
cd rn-build-app
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Inicie o servidor Expo

Para iniciar limpando o cache:

```bash
npx expo start -c
```

### 4️⃣ Execute no Android

Para abrir diretamente no emulador:

```bash
npx expo start --android
```

Ou, depois de executar `npx expo start`, pressione `a` no terminal.

### ⚠️ Windows — PowerShell

Se o PowerShell apresentar erros de política de execução ao usar comandos como `npx`, abra-o como administrador e execute:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Feche e abra o terminal novamente e tente de novo:

```bash
npx expo start
```

---

## 📱 Plataformas Suportadas

| Plataforma | Como executar |
| --- | --- |
| 🤖 **Android** | Emulador ou APK |
| 🍎 **iOS** | Simulador ou Expo Go |
| 📱 **Dispositivo físico** | Expo Go (leia o QR Code do terminal) |

---

## 🌿 Git Flow

A branch `develop` é usada para o desenvolvimento e a consolidação de novas funcionalidades.

```text
develop
   │
   ├── Desenvolvimento
   ├── Novas funcionalidades
   └── Correções
          │
          ▼
       master
          │
          └── Versão de produção
```

**Ir para a branch de desenvolvimento**

```bash
git checkout develop
```

**Criar uma nova branch**

```bash
git checkout -b feature/nome-da-feature
```

**Enviar a branch para o repositório remoto**

```bash
git push -u origin feature/nome-da-feature
```

---

<div align="center">

Feito com 💜 usando React Native e Expo

</div>
