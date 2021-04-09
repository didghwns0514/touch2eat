# -Touch2Eat-

An webpage using Google maps API, places API to suggest you places to eat foods based on your current location.

> Compatability checked with PC Chrome browser.
>
> Distributed using heroku.
>
> To check out the webpage, click the following [(site Location)](https://touch2eat.herokuapp.com).

**Framework & library used :**

- Frontend : CSS, HTML, Javascript
- Server : Node.js Express
- Google login Authentication : Passport-google-oauth20, passport(cookie)

## Table of Contents

- Sections
  - [Touch2Eat](https://github.com/didghwns0514/touch2eat/blob/main/README.md#Touch2Eat)
  - [Usage](https://github.com/didghwns0514/touch2eat/blob/main/README.md#Usage)
  - [Maintainer](https://github.com/didghwns0514/touch2eat/blob/main/README.md#Maintainer)

## Sections

### Touch2Eat

**Status :** Live and distributed

**Link :** [(site Location)](https://touch2eat.herokuapp.com)

**Used :**

- Frontend
  
  - HTML, JavaScript
  - CSS : Responsive layout
  - CDN : anijs-min.js, scrollreveal.js ( for dynamic front page )

- Backend
  - node.js : package described ([link Location](https://github.com/didghwns0514/touch2eat/blob/main/package.json)) \
  `Express` for starting the server \
  `Router` and `index` to render html on client side request
  
  - Database \
    ※ tobe added in the future, using either JavaSpring or Express  \
    to track personal preference of the dinning places

- Map page
  - `Google Map api` and `Google Place api`
  - Datas including API are rendered in the client side \
    ( due to geolocation usage and light-weight-filtering function )

-----------

### Usage

**Simple usage :**

- gif \
  ![image](https://user-images.githubusercontent.com/47662495/114208146-23d25e00-9998-11eb-8375-45e359059711.gif)

-----------

### Maintainer

**People**: Yang HoJun(양호준)(didghwns0514@gmail.com)

**More Info:**

- Github link : [Link](https://github.com/didghwns0514/touch2eat)
- Personal Blog : [Link](https://korshika.tistory.com/)

**Suggestions:**

- Feel free to contact

-----------

## Definitions

*These definitions are provided to clarify any terms used above.*

- **Documentation repositories**: Feel free to share. Thank you!