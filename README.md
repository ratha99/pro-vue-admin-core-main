# Dashcode (Node V-14)

## Project setup
```
1. download latest node js version from https://nodejs.org/en
2. run command "npm install --global yarn"
3. run window powershell as admin and run "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned"
4. run command "yarn install"
5. run command "yarn add vue-i18n"
6. run command "yarn run dev"
```

## Translation Syntax
```
$t{'message'}
```

## Axio Syntax
```
GET method use this.$services().get(endpoint)...
Post method use this.$services().post(endpoint, data)...
PUT method use this.$services().put(endpoint, data)...
DELETE method use this.$services().remove(endpoint, id)...

Sample:
this.$services().get(endpoint)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
this.$services().post(endpoint, data)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
this.$services().put(endpoint, data)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });
this.$services().remove(endpoint, id)
        .then((response) => {
          console.log(response);
        })
        .catch((e) => {
          console.log(e);
        });

```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
