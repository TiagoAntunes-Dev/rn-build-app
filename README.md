# 🎬 Movie App — React Native & Expo Router

![Expo](https://img.shields.io/badge/Expo-v51.0-000000?style=for-the-badge\&logo=expo\&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-v4-38BDF8?style=for-the-badge\&logo=tailwindcss\&logoColor=white)

Aplicação mobile para exploração de filmes, desenvolvida com **React Native**, **Expo Router** e **NativeWind v4**.

O projeto utiliza uma arquitetura baseada em rotas e layouts, com foco em organização, reutilização de componentes e desenvolvimento multiplataforma.

---

## 🚀 Tecnologias e Ferramentas

* **[React Native](https://reactnative.dev/)** — Framework para desenvolvimento de aplicações mobile multiplataforma.
* **[Expo Router](https://docs.expo.dev/router/introduction/)** — Sistema de navegação baseado em arquivos (*File-based Routing*).
* **[NativeWind v4](https://www.nativewind.dev/)** — Biblioteca de estilização baseada em Tailwind CSS para React Native.
* **[TypeScript](https://www.typescriptlang.org/)** — Linguagem que adiciona tipagem estática ao JavaScript.
* **Metro Bundler** — Bundler utilizado pelo Expo/React Native para processar e empacotar a aplicação.

---

## 📁 Estrutura do Projeto

O projeto utiliza o diretório `src/app` como raiz das rotas, seguindo a arquitetura baseada em arquivos do **Expo Router**.

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

## 📍 Funcionalidades Principais

* [x] **Navegação por abas** — Organização das principais telas utilizando `expo-router`.
* [x] **Rotas dinâmicas** — Utilização de `[id].tsx` para acessar os detalhes de cada filme.
* [x] **NativeWind v4** — Estilização utilizando classes utilitárias através da propriedade `className`.
* [x] **Arquitetura baseada em layouts** — Separação entre o layout raiz e a navegação por abas.
* [x] **Componentes reutilizáveis** — Organização dos elementos de interface para facilitar manutenção e reutilização.

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

* [Node.js](https://nodejs.org/) — versão LTS recomendada
* [Git](https://git-scm.com/)
* [Expo Go](https://expo.dev/go/) — caso utilize um dispositivo físico
* Android Studio e um emulador Android, caso queira executar a aplicação em um emulador

---

### 1. Clone o repositório

Clone a branch `develop`:

```bash
git clone -b develop https://github.com/SEU-USUARIO/rn-build-app.git
```

Entre no diretório do projeto:

```bash
cd rn-build-app
```

---

### 2. Instale as dependências

```bash
npm install
```

---

### 3. Inicie o servidor Expo

Para iniciar o projeto limpando o cache:

```bash
npx expo start -c
```

---

### 4. Execute no Android

Para abrir diretamente no emulador Android:

```bash
npx expo start --android
```

Ou, após executar `npx expo start`, pressione:

```text
a
```

no terminal.

---

## ⚠️ Windows — PowerShell

Caso o PowerShell apresente erros relacionados à política de execução ao utilizar comandos como `npx`, execute o PowerShell como administrador e configure a política para o usuário atual:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Depois disso, feche e abra o terminal novamente e tente executar o comando:

```bash
npx expo start
```

---

## 🌿 Git Flow

Este repositório utiliza a branch `develop` para o desenvolvimento e consolidação de novas funcionalidades.

A estrutura de branches utilizada é:

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

### Branch principal de desenvolvimento

```bash
git checkout develop
```

### Criar uma nova branch

```bash
git checkout -b feature/nome-da-feature
```

### Enviar a branch para o repositório remoto

```bash
git push -u origin feature/nome-da-feature
```

---

## 📱 Execução

O projeto pode ser executado em:

* 🤖 **Android**
* 🍎 **iOS**
* 📱 **Dispositivo físico utilizando Expo Go**

---

## 👨‍💻 Desenvolvedor

**Tiago Antunes**

Projeto desenvolvido para estudos e prática de desenvolvimento mobile utilizando **React Native**, **Expo Router**, **TypeScript** e **NativeWind**.

