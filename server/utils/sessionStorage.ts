import { useStorage } from '#imports';

export async function setUser(stateId: string, user: string){
  const storage = useStorage();
  await storage.setItem(stateId, user)
}
export const getUser = async (stateId: string) => {
  const storage = useStorage();
  return await storage.getItem(stateId)
}
export async function killUser(stateId: string){
  const storage = useStorage();
  storage.removeItem(stateId)
}