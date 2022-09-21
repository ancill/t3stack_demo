import { inferProcedureOutput } from '@trpc/server';
import { createContext, useContext } from 'react';
import { AppRouter } from '../server/createRouter';




type TQuery = keyof AppRouter['_def']['queries']

type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<AppRouter['_def']['queries'][TRouteKey]>

const UserContext = createContext<InferQueryOutput<'user.me'>>(null)


function UserContextProvider({ children, value }: {
	children: React.ReactNode,
	value: InferQueryOutput<'user.me'> | undefined
}) {
	return <UserContext.Provider value={value || null}>{children}</UserContext.Provider>
}


const useUserContext = () => useContext(UserContext)

export { useUserContext, UserContextProvider }