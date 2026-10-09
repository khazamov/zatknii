# Pipe Monkeys / ZATKNI — лендинги для филиала в России

## A/B: две версии

| Вариант | URL (локально) | Описание |
|---------|----------------|----------|
| **A — main** | http://localhost:8081/ | Полный лендинг Pipe Monkeys (услуги, цены от 3 000 ₽) |
| **B — draper** | http://localhost:8081/draper/ | Минималистичный арт-лендинг ZATKNI (фото, слоган, телефон) |

В рекламе или аналитике ведите трафик на разные URL; корневую страницу не меняем.

---

Статический одностраничный сайт в стиле [pipemonkeys.com](https://pipemonkeys.com/main-sewer-line-cleaning/): прочистка канализации, ливнёвок, дренажа, устранение засоров. Цены от **3 000 ₽**.

## Состав

- `index.html` — страница
- `css/style.css` — стили (цвета и блоки как у Pipe Monkeys)
- `js/main.js` — телефон, маска номера, форма заявки

## Быстрый деплой

### 1. Любой хостинг с FTP (Timeweb, Beget, REG.RU и т.п.)

1. Загрузите папку целиком в `public_html` или `www`.
2. Откройте домен в браузере — должна открыться `index.html`.

### 2. Nginx

```nginx
server {
    listen 80;
    server_name example.ru;
    root /var/www/pipe-monkeys-ru;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 3. Локальная проверка

```bash
cd /path/to/САНУЗЛЫ
python3 -m http.server 8080
```

Откройте http://localhost:8080

## Настройка перед запуском

### Телефон

В файле `js/main.js` измените:

```javascript
var CONFIG = {
  phoneDisplay: "+7 (495) 123-45-67",
  phoneTel: "+74951234567",
  ...
};
```

Все ссылки с `data-phone-tel` и текст с `data-phone-text` подставятся автоматически.

### Заявки в Telegram (необязательно)

1. Создайте бота через [@BotFather](https://t.me/BotFather), получите **token**.
2. Узнайте **chat_id** (например, напишите боту и откройте `https://api.telegram.org/bot<TOKEN>/getUpdates`).
3. В `js/main.js`:

```javascript
telegramBotToken: "123456:ABC...",
telegramChatId: "-1001234567890",
```

Если Telegram не настроен, после отправки формы пользователю показывается сообщение и открывается набор номера для звонка.

### Логотип

Сейчас используется SVG в шапке. Чтобы поставить свой логотип Pipe Monkeys, замените блок `<svg class="pm-brand__mark">` на:

```html
<img src="images/logo.webp" alt="Pipe Monkeys" width="185" height="80">
```

## Услуги на сайте

| Услуга | Цена от |
|--------|---------|
| Очистка канализации | 3 000 ₽ |
| Устранение засоров | 3 000 ₽ |
| Очистка ливнёвок | 3 500 ₽ |
| Очистка дренажной системы | 4 000 ₽ |

Точные суммы правьте в `index.html` (карточки услуг и таблица `#pricing`).

## SEO

В `<head>` уже есть `title`, `description` и JSON-LD (`LocalBusiness`, `Service`, `FAQPage`). Подставьте свой город в тексты и schema при необходимости.
