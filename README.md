# 🥗 [tracky](https://www.tracky.fit) &middot; ![Next.js Badge](https://img.shields.io/badge/Next.js 15-000?logo=nextdotjs =fff =flat) ![Postgre Badge](https://img.shields.io/badge/postgresql-4169e1?style=flat&logo=postgresql&logoColor=white) [![CI](https://github.com/fraineralex/tracky/actions/workflows/ci.yml/badge.svg)](https://github.com/fraineralex/tracky/actions/workflows/ci.yml) [![GitHub license](https://img.shields.io/badge/license-MIT-004DFF.svg)](https://github.com/fraineralex/tracky/blob/main/LICENSE) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://legacy.reactjs.org/docs/how-to-contribute.html#your-first-pull-request) [![PRs Welcome](https://img.shields.io/badge/state-beta-FF0065.svg)](https://legacy.reactjs.org/docs/how-to-contribute.html#your-first-pull-request) ![Website](https://img.shields.io/website-running-stopped-7B2EFF-red/https/tracky.fit.svg)

**Problem:** Fitness apps often bury simple meal and workout logging under feature bloat.

**Solution:** Tracky is a minimalist fitness tracker focused on logging meals, workouts, and progress without clutter. AI-assisted chat helps users add entries quickly.

**Stack:** Next.js App Router, React, TypeScript, Drizzle ORM, PostgreSQL, Clerk, Vercel AI SDK, Tailwind CSS, and shadcn/ui.

**Quick start:** Clone the repo, copy `.env.example` to `.env.local`, install dependencies with `bun install`, run database setup (`bun db:generate`, `bun db:push`, `bun db:seed`), then start the app with `bun dev`. See [Running the Project](#-running-the-project) for details.

A smart, robust and minimalist fitness tracking web app built with `T3 Stack` with AI-powered features to quickly log meals and exercises. It helps users follow their fitness journey every step of the way, without overwhelming them with unnecessary features. With a modern interface, **tracky** makes it easy to log workouts and meals, keeping users focused on progress while simplifying their path to achieving fitness goals.

![Open graph image of tracky](https://pub-f159aa4256dd4a64ae2f0c18d87e674e.r2.dev/gh.webp)

## 📦 Technologies

- [**create-t3-app**](https://create.t3.gg) - The best way to start a full-stack, typesafe Next.js app.
- [**Next.js 15 App Router**](https://nextjs.org/) - The React Framework for the Web.
- [**React 19**](https://react.dev/) - The library for web and native user interfaces.
- [**Clerk v5**](https://clerk.com/) - Authentication and User Management.
- [**Drizzle**](https://orm.drizzle.team) - A next generation TypeScript ORM.
- [**Neon**](https://neon.tech/) - A Serverless Postgres solution designed for modern applications.
- [**Next.js Server Actions**](https://nextjs.org/docs/api-reference/server-actions) - Asynchronous functions that are executed on the server.
- [**Next.js Partial Prerendering**](https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering) - Combine static and dynamic components together in the same route.
- [**OpenAI API**](https://openai.com/index/openai-api) + [**Vercel AI SDK**](https://sdk.vercel.ai/docs/introduction) - AI-driven features using OpenAI models and Vercel’s streamlined SDK.
- [**Cloudflare R2**](https://www.cloudflare.com/products/r2/) - Serverless object storage for media and static assets.
- [**TailwindCSS**](https://tailwindcss.com) + [**shadcn/ui**](https://ui.shadcn.com) & [**Radix Primitives**](https://www.radix-ui.com) - Design System.
- [**Prettier**](https://prettier.io) with [**prettier-plugin-tailwindcss**](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) - Code Formatter.
- [**Lucide Icons**](https://lucide.dev) + [**svgl**](https://svgl.app) - Beautiful SVG icons & logos for the web.

## 🚀 Features

- 🧭 Intuitive fitness tracking to easily log workouts and meals.
- 🏋️‍♂️ Track workout details like exercise type, duration, and intensity.
- 🍎 Record meals and track nutrition with simple inputs.
- 📊 View progress through detailed charts and stats.
- 🥇 Set and track fitness goals with real-time progress updates.
- 🔍 Search and filter past workouts and meals for easy reference.
- 🧠 Intelligent chat powered by openai api to automatically add meals or workouts to your log.
- 📥 Get meal and workout suggestions directly from the chat feature.
- 🌐 Minimalist, modern interface for a seamless user experience.
- ❌ No unnecessary clutter—Tracky focuses on what matters most for your fitness journey.
- 📝 Track and review all your activities in a detailed diary, helping you maintain accountability and monitor your progress over time.

## 🛠️ tracky Pages

- **`Landing`** - Introduction to **tracky**, showcasing its features and benefits to new users.
- **`Onboarding`** - Step-by-step guide to help users set up their fitness goals, preferences, and profile.
- **`Dashboard`** - Overview of user progress, personalized stats, and quick access to key features.
- **`Food`** - Track food intake and macros, quickly log meals via AI-powered chat.
- **`Exercise`** - Log workouts and access plans, quickly log exercises via AI-powered chat.
- **`Diary`** - A daily log of activities, meals, exercises, and progress tracking.
- **`Settings`** - Customize user preferences, profile details, and app configurations.

## 🚦Running the Project

To run the project in your local environment, follow these steps:

1. Clone the repository to your local machine.
2. Rename the file: `.env.example` to `.env.local`.
3. Fill in the values of the environment variables with your own data.
4. Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
5. Navigate to the root directory of the project and install dependencies by running `bun install`.
6. Prepare the database by running the following commands:
   - `bun db:generate`
   - `bun db:push`
   - `bun db:seed`
7. Once the dependencies are installed, start the project by running `bun dev`.
8. You can access the app at: [http://localhost:3000](http://localhost:3000).

That's it! Your project should now be up and running locally.

## 🌟 Contributions

Thank you for exploring this project! If you find the structure or features useful, feel free to use this code for your project. Contributions are welcome! If you have ideas, corrections, or improvements, please open an issue or send a pull request. Your collaboration is valued and appreciated! 🚀

tracky is [MIT licensed](/LICENSE). 💚
