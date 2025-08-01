# Landfill Report
Ова е апликација која овозможува на корисниците да пријават нелегални депониии со цел да им се помогне на надлежните (админот) да ги исчистат и сопрат. Дополнително, со помош на AI, надлежните можат да видат на кои следни места се претпоставува дека би се направила депонија.

## Карактеристики
### Функционалности на корисникот
- Пријавување на депонија преку форма со:
  - Локација
  - Опис
  - Слика
### Функционалности на админот
- Пристап до листа од сите пријави
- Ажурирање на статус на пријавите (Pending, In Progress, Rejected)
- Предвидување на следни депонии со помош на вештачка интелигенција
- Преглед на интерактивна мапа со пријавените и предвидените депонии
### Предвидување базирано на вештачка интелигенција
- Користи K-Means кластерирање за да ги идентификува кластерите на депониите
- Предвидува локации на следни три депонии
- Ги филтрира и прилагодува предвидувањата ако тие се поклопат со веќе познатите пријави

## Користени технологии
### Backend
- Java 17
- Spring Boot
- Spring Security (JWT Автентикација)
- Spring Data JPA (PostgreSQL)
- Smile (за KMeans кластерирање)
- Lombok

### Frontend
- React
- Chakra UI
- Leaflet (мапа)

### Database
- PostgreSQL
