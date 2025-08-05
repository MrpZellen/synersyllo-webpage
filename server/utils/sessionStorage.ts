import { useStorage } from '#imports';

function userKey(id: string) {
  return `user:${id}`;
}
function passKey(id: string) {
  return `pass:${id}`;
}
function registerKey(id: string) {
  return `register:${id}`;
}
function cidKey(id: string) {
  return `cid:${id}`;
}
function adminKey(id: string) {
  return `admin:${id}`;
}
function pageKey(id: string) {
  return `page:${id}`;
}

//SET AND GET USER
export async function setUser(stateId: string, user: string){
  const storage = useStorage();
  await storage.setItem(userKey(stateId), user)
}
export const getUser = async (stateId: string) => {
  const storage = useStorage();
  return await storage.getItem(userKey(stateId))
}
export async function killUser(stateId: string){
  const storage = useStorage();
  storage.removeItem(userKey(stateId))
}
//SET AND GET REGISTERSTATUS
export async function setRegister(stateId: string, isRegistered: boolean){
  const storage = useStorage();
  await storage.setItem(registerKey(stateId), isRegistered)
}
export const getRegister = async (stateId: string) => {
  const storage = useStorage();
  return await storage.getItem(registerKey(stateId))
}
export async function killRegister(stateId: string){
  const storage = useStorage();
  storage.removeItem(registerKey(stateId))
}
// SET AND GET PASS
export async function setPass(stateId: string, pass: string){
  const storage = useStorage();
  await storage.setItem(passKey(stateId), pass)
}
export const getPass = async (stateId: string) => {
  const storage = useStorage();
  return await storage.getItem(passKey(stateId))
}
export async function killPass(stateId: string){
  const storage = useStorage();
  storage.removeItem(passKey(stateId))
}

// SET AND GET CID (registration)
export async function setCID(stateId: string, companyID: string){
  const storage = useStorage();
  await storage.setItem(cidKey(stateId), companyID)
}
export const getCID = async (stateId: string) => {
  const storage = useStorage();
  return await storage.getItem(cidKey(stateId))
}
export async function killCID(stateId: string){
  const storage = useStorage();
  storage.removeItem(cidKey(stateId))
}

// SET AND GET ADMIN STATUS (registration admin)
export async function setAdmin(stateId: string, admin: boolean){
  const storage = useStorage();
  await storage.setItem(adminKey(stateId), admin)
}
export const getAdmin = async (stateId: string) => {
  const storage = useStorage();
  return await storage.getItem(adminKey(stateId))
}
export async function killAdmin(stateId: string){
  const storage = useStorage();
  storage.removeItem(adminKey(stateId))
}

//SET AND GET PAGE
export async function setPage(stateId: string, page: number){
  const storage = useStorage();
  await storage.setItem(pageKey(stateId), page)
}
export const getPage = async (stateId: string) => {
  const storage = useStorage();
  return await storage.getItem(pageKey(stateId))
}
export async function killPage(stateId: string){
  const storage = useStorage();
  storage.removeItem(pageKey(stateId))
}
//TODO: redefine as an item?