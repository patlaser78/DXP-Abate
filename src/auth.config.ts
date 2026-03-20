import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export default {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    
                    // QUICK LOGIN BYPASS
                    if (email === "admin@abatedeveiculos.pt" && password === "admin123") {
                        return { id: "1", name: "Administrador SCM", email: "admin@abatedeveiculos.pt", role: "ADMIN" };
                    }
                }
                
                return null;
            },
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnProcessos = nextUrl.pathname.startsWith('/processos');
            const isOnAgenda = nextUrl.pathname.startsWith('/agenda');
            const isOnDefinicoes = nextUrl.pathname.startsWith('/definicoes');
            const isOnScanner = nextUrl.pathname.startsWith('/scanner');

            const isProtectedAppRoute = isOnDashboard || isOnProcessos || isOnAgenda || isOnDefinicoes || isOnScanner;

            if (isProtectedAppRoute) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && nextUrl.pathname === '/login') {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }

            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id as string;
            }
            return session;
        }
    },
} satisfies NextAuthConfig;
