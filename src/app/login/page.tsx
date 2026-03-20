'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/auth-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Recycle, ArrowRight, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          A Entrar...
        </>
      ) : (
        <>
          Entrar no Sistema
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-zinc-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/50 via-zinc-950 to-zinc-950 -z-10" />
      
      <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6 flex flex-col items-center">
          <div className="h-16 w-16 bg-lime-500/10 rounded-2xl flex items-center justify-center border border-lime-500/20 mb-2">
            <Recycle className="h-8 w-8 text-lime-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white text-center">SCM Abate</CardTitle>
          <CardDescription className="text-zinc-400 text-center">
            Faça login para gerir os processos de abate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@abatedeveiculos.pt"
                required
                className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-lime-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                required
                className="bg-zinc-950/50 border-zinc-800 text-white focus-visible:ring-lime-500"
              />
            </div>
            
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
              </div>
            )}
            
            <LoginButton />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-6">
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} SCM Sucata Casal do Marco
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
