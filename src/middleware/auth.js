export default function auth({ next, to, store}){
  const userRolePer = JSON.parse(localStorage.getItem('userRolePermission'));
  try{
    const permissions = userRolePer.permissions;
    const loginExpired = JSON.parse(localStorage.getItem('loginExpired'));
    var currentDate = new Date().toISOString().slice(0, 10);

    if(loginExpired == null) {
      return next({ name: "Login" });
    }

    if(parseInt(currentDate.replace(/-/g,""),10) > parseInt(loginExpired.replace(/-/g,""),10)){
      return next({ name: "Login" });
    }

    if (permissions.filter(e => e.slug === to.meta.slug).length <= 0) {
      return next({name: "403"})
    }
  }catch(e){}
 

  if (localStorage.activeUser) {
    return next();
  }
  return next({ name: "Login" });
}