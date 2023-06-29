# RDO.GG Tunables
RDO.GG Tunables is a website that allows users to visualize tunable files easily and compare changes over time. It can be used to both visualize tunables for Red Dead Online (RDO) and GTA: Online (GTAO).

## Contributing
Thank you for considering contributing to RDO.GG Tunables! Please note that this project is released with a [Contributor Covenant Code of Conduct](https://github.com/Senexis/RDO-GG-Tunables/blob/main/CODE_OF_CONDUCT.md). By participating in any way in this project, you agree to abide by its terms.

Before contributing, please take a moment to read the [Contribution Guide](https://github.com/Senexis/RDO-GG-Tunables/blob/main/CONTRIBUTING.md) to understand the development process and how to contribute.

## Updating data files
You can contribute by updating any of the data files that the website uses to display data. You can find the files you can update in `/public/data/`.

Please note that each of the files are required to be in their original format, unless you also update the code that reads the files. You can find a short explanation of what each data file does below:

- **daily_objectives.json:** Contains an ordered array of all possible Daily Objectives in GTA V.
- **hsw_time_trials.json:** Contains an ordered array of the names of all HSW Time Trials in GTA V.
- **labels.json:** Contains an object of item labels in GTA V (only the ones that are used).
- **rc_time_trials.json:** Contains an ordered array of the names of all RC Bandito Time Trials in GTA V.
- **time_trials.json:** Contains an ordered array of the names of all Time Trials in GTA V.
- **tunable_types.json:** Contains an unordered array of the tunable types used for displaying sales and bonuses in GTA V.

Before touching any of these files, take your time to familiarize yourself with the file itself. Please ensure that the JSON is valid and, again, uses to original format.
In general, I don't expect these files will need many updates, unless GTA V updates. The file I need the most help with for now is **tunable_types.json**.

## Security
If you discover any security related issues, please email the maintainer directly using the information provided in the [Security Policy](https://github.com/Senexis/RDO-GG-Tunables/blob/main/SECURITY.md).

## License
RDO.GG Tunables is open-sourced software licensed under the [MIT license](https://github.com/Senexis/RDO-GG-Tunables/blob/main/LICENSE.md).
