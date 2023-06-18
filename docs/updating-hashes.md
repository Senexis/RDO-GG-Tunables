# Updating Hashes
Credits for providing an easily and publicly accessible JSON dump of hashes go to [DurtyFree](https://github.com/DurtyFree/gta-v-data-dumps).

## Instructions
While there may be easier ways of doing this, I decided to be lazy and use a web-based JSON editor. This is the process I used to update the hashes.

1. Go to [JSON Editor Online](https://jsoneditoronline.org/)
2. Import the file from URL
3. Click "Transform"
4. Paste in the code bits below

### Vehicles
Import URL: `https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/vehicles.json`

```js
function query(data) {
  data = _.map(data, (item) => [item?.Name?.toUpperCase(), `${item?.ManufacturerDisplayName?.English ?? ""} ${item?.DisplayName?.English ?? ""}`.trim()])
    .filter((i) => i[1] !== "")
    .sort((a, b) => a[0].localeCompare(b[0]));
  return _.chain(data)
    .keyBy(0)
    .mapValues(1)
    .value();
}
```

### Weapons
Import URL: `https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/weapons.json`

```js
function query(data) {
  data = _.map(data, (item) => [item?.Name?.toUpperCase(), item?.TranslatedLabel?.English ?? ""])
    .filter((i) => i[1] !== "" && i[1]?.toUpperCase() !== "INVALID")
    .sort((a, b) => a[0].localeCompare(b[0]));
  return _.chain(data)
    .keyBy(0)
    .mapValues(1)
    .value();
}
```
