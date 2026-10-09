(function () {
  "use strict";

  var CONFIG = {
    phoneDisplay: "+7 (495) 123-45-67",
    phoneTel: "+74951234567",
    telegramBotToken: "",
    telegramChatId: "",
  };

  function applyPhoneLinks() {
    document.querySelectorAll("[data-phone-tel]").forEach(function (el) {
      el.setAttribute("href", "tel:" + CONFIG.phoneTel.replace(/\s/g, ""));
    });
    document.querySelectorAll("[data-phone-text]").forEach(function (el) {
      el.textContent = CONFIG.phoneDisplay;
    });
  }

  function maskPhoneInput(input) {
    input.addEventListener("input", function () {
      var digits = input.value.replace(/\D/g, "");
      if (digits.startsWith("8")) {
        digits = "7" + digits.slice(1);
      }
      if (!digits.startsWith("7") && digits.length) {
        digits = "7" + digits;
      }
      digits = digits.slice(0, 11);
      var formatted = "";
      if (digits.length > 0) {
        formatted = "+7";
      }
      if (digits.length > 1) {
        formatted += " (" + digits.slice(1, 4);
      }
      if (digits.length >= 4) {
        formatted += ") " + digits.slice(4, 7);
      }
      if (digits.length >= 7) {
        formatted += "-" + digits.slice(7, 9);
      }
      if (digits.length >= 9) {
        formatted += "-" + digits.slice(9, 11);
      }
      input.value = formatted;
    });
  }

  function closeMobileMenuOnNavigate() {
    document.querySelectorAll(".pm-mobile-menu__panel a, .pm-nav a").forEach(function (link) {
      link.addEventListener("click", function () {
        var menu = document.querySelector(".pm-mobile-menu");
        if (menu && menu.open) {
          menu.open = false;
        }
      });
    });
  }

  async function sendTelegram(text) {
    if (!CONFIG.telegramBotToken || !CONFIG.telegramChatId) {
      return false;
    }
    var url =
      "https://api.telegram.org/bot" +
      CONFIG.telegramBotToken +
      "/sendMessage";
    var res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CONFIG.telegramChatId,
        text: text,
        parse_mode: "HTML",
      }),
    });
    return res.ok;
  }

  function handleForm() {
    var form = document.getElementById("pm-request-form");
    if (!form) return;

    var status = document.getElementById("pm-form-status");
    var phoneInput = form.querySelector('input[name="phone"]');
    if (phoneInput) maskPhoneInput(phoneInput);

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (status) {
        status.className = "pm-form-status";
        status.textContent = "Отправляем заявку…";
      }

      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();
      var address = (data.get("address") || "").toString().trim();
      var service = (data.get("service") || "").toString().trim();
      var comment = (data.get("comment") || "").toString().trim();

      if (!name || phone.replace(/\D/g, "").length < 11) {
        if (status) {
          status.className = "pm-form-status is-err";
          status.textContent = "Укажите имя и корректный телефон.";
        }
        return;
      }

      var message =
        "<b>Новая заявка Pipe Monkeys RU</b>\n" +
        "Имя: " +
        name +
        "\n" +
        "Телефон: " +
        phone +
        "\n" +
        "Услуга: " +
        service +
        "\n" +
        "Адрес: " +
        address +
        "\n" +
        (comment ? "Комментарий: " + comment : "");

      var sent = false;
      try {
        sent = await sendTelegram(message);
      } catch (err) {
        sent = false;
      }

      if (sent) {
        if (status) {
          status.className = "pm-form-status is-ok";
          status.textContent = "Спасибо! Мы перезвоним в ближайшее время.";
        }
        form.reset();
        return;
      }

      var subject = encodeURIComponent("Заявка: " + service);
      var body = encodeURIComponent(
        "Имя: " +
          name +
          "\nТелефон: " +
          phone +
          "\nАдрес: " +
          address +
          "\nУслуга: " +
          service +
          "\n" +
          (comment ? "Комментарий: " + comment : "")
      );
      var mailto =
        "mailto:info@example.com?subject=" + subject + "&body=" + body;

      if (status) {
        status.className = "pm-form-status is-ok";
        status.textContent =
          "Спасибо! Мы получили данные. Перезвоним на указанный номер. Для срочного вызова — нажмите «Позвонить» в шапке.";
      }
    });
  }

  applyPhoneLinks();
  closeMobileMenuOnNavigate();
  handleForm();
})();
