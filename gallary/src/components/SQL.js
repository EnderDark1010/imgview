export function removeBasicSQL(s){
    const regex= new RegExp('(select|insert|delete|update)');
    return s.replace(regex,"")
}
