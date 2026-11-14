/**
 * ==========================================================================
 * پروپوزال جامع و تخصصی خدمات سئو و دیجیتال مارکتینگ — آبان ۱۴۰۵
 * فایل منطق و تعاملات (script.js) | جاوااسکریپت خالص (Vanilla ES6+)
 * ==========================================================================
 */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
   * ۱. داده‌های دقیق قیمت‌گذاری ۵ پلن (منطبق با متن رسمی پروپوزال - آبان ۱۴۰۵)
   * ------------------------------------------------------------------------ */
  const HIGH_VOLUME_NOTE = '(این پلن به دلیل حجم بالای خدمات و توسعه ممکن است بیش از یک ماه زمان‌بندی شود)';

  const PLANS_DATA = {
    bronze: {
      id: 'bronze', name: 'پلن ۱: برنزی', emoji: '🥉', minMonths: 1, minLabel: '۱ ماه', isHighVolume: false,
      prices: {
        monthly: { total: 15000000, months: 1, discountPct: 0 },
        '3m': { total: 42300000, months: 3, discountPct: 6 },
        '6m': { total: 79200000, months: 6, discountPct: 12 },
        '12m': { total: 142200000, months: 12, discountPct: 21 }
      }
    },
    silver: {
      id: 'silver', name: 'پلن ۲: نقره‌ای', emoji: '🥈', minMonths: 1, minLabel: '۱ ماه', isHighVolume: false,
      prices: {
        monthly: { total: 25000000, months: 1, discountPct: 0 },
        '3m': { total: 69750000, months: 3, discountPct: 7 },
        '6m': { total: 130500000, months: 6, discountPct: 13 },
        '12m': { total: 243000000, months: 12, discountPct: 19 }
      }
    },
    gold: {
      id: 'gold', name: 'پلن ۳: طلایی', emoji: '🥇', minMonths: 1, minLabel: '۱ ماه', isHighVolume: true,
      prices: {
        monthly: { total: 35000000, months: 1, discountPct: 0 },
        '3m': { total: 97650000, months: 3, discountPct: 7 },
        '6m': { total: 180600000, months: 6, discountPct: 14 },
        '12m': { total: 331800000, months: 12, discountPct: 21 }
      }
    },
    diamond: {
      id: 'diamond', name: 'پلن ۴: سازمانی', emoji: '🏢', minMonths: 1, minLabel: '۱ ماه', isHighVolume: true,
      prices: {
        monthly: { total: 55000000, months: 1, discountPct: 0 },
        '3m': { total: 132000000, months: 3, discountPct: 20 },
        '6m': { total: 231000000, months: 6, discountPct: 30 },
        '12m': { total: 363000000, months: 12, discountPct: 45 }
      }
    },
    ecommerce: {
      id: 'ecommerce', name: 'پلن ۵: فروشگاهی', emoji: '🛒', minMonths: 1, minLabel: '۱ ماه', isHighVolume: true,
      prices: {
        monthly: { total: 45000000, months: 1, discountPct: 0 },
        '3m': { total: 108000000, months: 3, discountPct: 20 },
        '6m': { total: 189000000, months: 6, discountPct: 30 },
        '12m': { total: 297000000, months: 12, discountPct: 45 }
      }
    }
  };

  /* ساختار اقساط مطابق بخش هفتم پروپوزال */
  const INSTALLMENT_RULES = {
    monthly: [
      { title: 'پرداخت ماهانه (ابتدای هر ماه)', pct: 100 }
    ],
    '3m': [
      { title: 'مرحله اول — همزمان با عقد قرارداد', pct: 50 },
      { title: 'مرحله دوم — ابتدای ماه دوم', pct: 50 }
    ],
    '6m': [
      { title: 'مرحله اول — همزمان با عقد قرارداد', pct: 40 },
      { title: 'مرحله دوم — ابتدای ماه سوم', pct: 30 },
      { title: 'مرحله سوم — ابتدای ماه پنجم', pct: 30 }
    ],
    '12m': [
      { title: 'مرحله اول — همزمان با عقد قرارداد', pct: 30 },
      { title: 'مرحله دوم — ابتدای ماه چهارم', pct: 25 },
      { title: 'مرحله سوم — ابتدای ماه هفتم', pct: 25 },
      { title: 'مرحله چهارم — ابتدای ماه دهم', pct: 20 }
    ]
  };

  const CYCLE_LABELS = {
    monthly: 'ماهانه',
    '3m': '۳ ماهه',
    '6m': '۶ ماهه',
    '12m': 'سالانه (۱۲ ماهه)'
  };

  /* ------------------------------------------------------------------------
   * ۱-ب. مخزن کدگذاری‌شده هویت برند و موتور محافظت ۵ لایه (حالت الف)
   * ------------------------------------------------------------------------ */
  const VAULT_CIPHER_B64 =
    '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';
  const VAULT_XOR_KEY = [0x5a, 0xc3, 0x91, 0x3e, 0x77, 0xa8, 0x4d, 0xe2, 0x19, 0xb6, 0x6c, 0xf1];
  const EXPECTED_VAULT_HASH = 0x9cae917b;

  let isTamperLocked = false;
  let isVaultSyncing = false;
  let vaultObserver = null;
  let vaultHeartbeatTimer = null;
  let activeInvoiceDateText = null;

  function fnv1a32(byteArr) {
    let h = 0x811c9dc5;
    for (let i = 0; i < byteArr.length; i++) {
      h ^= byteArr[i];
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function triggerTamperLock() {
    if (isTamperLocked) return;
    isTamperLocked = true;
    if (vaultObserver) {
      vaultObserver.disconnect();
      vaultObserver = null;
    }
    if (vaultHeartbeatTimer) {
      clearInterval(vaultHeartbeatTimer);
      vaultHeartbeatTimer = null;
    }
    document.documentElement.removeAttribute('data-vault-ready');
    if (document.body) {
      document.body.innerHTML =
        '<div id="vault-tamper-screen" class="vault-tamper-screen" role="alert">' +
        '<div class="vault-tamper-box">' +
        '<div class="vault-tamper-icon">⛔</div>' +
        '<h1>خطای یکپارچگی و اصالت سند</h1>' +
        '<p>فایل‌های هویتی، ساختار سند یا نشان تجاری این پروپوزال دستکاری شده‌اند و امکان نمایش یا چاپ آن وجود ندارد.</p>' +
        '</div></div>';
    }
  }

  function decodeBrandVault() {
    try {
      const binStr = atob(VAULT_CIPHER_B64);
      const rawBytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) {
        rawBytes[i] =
          binStr.charCodeAt(i) ^ VAULT_XOR_KEY[i % VAULT_XOR_KEY.length] ^ ((i * 13) & 0xff);
      }
      if (fnv1a32(rawBytes) !== EXPECTED_VAULT_HASH) {
        return null;
      }
      const jsonText = new TextDecoder('utf-8').decode(rawBytes);
      return Object.freeze(JSON.parse(jsonText));
    } catch (e) {
      return null;
    }
  }

  const BRAND_INFO = decodeBrandVault();

  /* ------------------------------------------------------------------------
   * ۲. توابع کمکی فرمت اعداد فارسی و اعلان (Toast)
   * ------------------------------------------------------------------------ */
  const faNumberFormatter = new Intl.NumberFormat('fa-IR');

  function formatFaNum(num) {
    return faNumberFormatter.format(Math.round(num));
  }

  function numberToPersianWords(num) {
    let n = Math.round(num);
    if (n === 0) return 'صفر';
    const ones = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
    const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
    const hundreds = ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
    const scales = ['', 'هزار', 'میلیون', 'میلیارد'];

    function threeDigits(val) {
      const parts = [];
      const h = Math.floor(val / 100);
      const rem = val % 100;
      if (h > 0) parts.push(hundreds[h]);
      if (rem >= 10 && rem < 20) {
        parts.push(teens[rem - 10]);
      } else {
        const t = Math.floor(rem / 10);
        const o = rem % 10;
        if (t > 0) parts.push(tens[t]);
        if (o > 0) parts.push(ones[o]);
      }
      return parts.join(' و ');
    }

    const groups = [];
    let scaleIdx = 0;
    while (n > 0) {
      const chunk = n % 1000;
      if (chunk > 0) {
        const words = threeDigits(chunk);
        groups.unshift(scales[scaleIdx] ? `${words} ${scales[scaleIdx]}` : words);
      }
      n = Math.floor(n / 1000);
      scaleIdx++;
    }
    return groups.join(' و ');
  }

  function toEnglishDigits(str) {
    if (!str) return '';
    const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    let res = String(str);
    for (let i = 0; i < 10; i++) {
      res = res.replace(new RegExp(persian[i], 'g'), i).replace(new RegExp(arabic[i], 'g'), i);
    }
    return res;
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('app-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /* ------------------------------------------------------------------------
   * ۳. مدیریت پوسته روشن / تیره (حالت تاریک به عنوان پیش‌فرض)
   * ------------------------------------------------------------------------ */
  function initTheme() {
    const saved = localStorage.getItem('seo_client_theme') || 'dark';
    applyTheme(saved);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('seo_client_theme', next);
        showToast(next === 'dark' ? 'حالت تیره فعال شد' : 'حالت روشن فعال شد');
      });
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon) {
      icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    if (label) {
      label.textContent = theme === 'dark' ? 'حالت روشن' : 'حالت تیره';
    }
  }

  /* ------------------------------------------------------------------------
   * ۴. نوار پیشرفت مطالعه، منوی کناری وردپرسی (WP Sidebar) و دکمه بازگشت به بالا
   * ------------------------------------------------------------------------ */
  function initScrollFeatures() {
    const progressBar = document.getElementById('reading-progress');
    const backToTop = document.getElementById('back-to-top');
    const menuGroups = Array.from(document.querySelectorAll('.wp-menu-group[data-section-group]'));
    const trackedSections = menuGroups
      .map((grp) => document.querySelector(grp.getAttribute('data-section-group')))
      .filter(Boolean);

    let lastActiveSectionId = '';

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;

      if (progressBar) {
        progressBar.style.width = pct + '%';
      }

      if (backToTop) {
        backToTop.classList.toggle('visible', scrollTop > 500);
      }

      let currentSectionId = '#top';
      const offset = scrollTop + 140;
      for (const sec of trackedSections) {
        if (sec.offsetTop <= offset) {
          currentSectionId = '#' + sec.id;
        }
      }

      if (currentSectionId !== lastActiveSectionId) {
        lastActiveSectionId = currentSectionId;
        menuGroups.forEach((grp) => {
          const isCurrent = grp.getAttribute('data-section-group') === currentSectionId;
          grp.classList.toggle('current', isCurrent);
          if (isCurrent && grp.classList.contains('has-sub') && grp.dataset.userClosed !== '1') {
            grp.classList.add('open');
          }
        });
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function toggleMenuGroup(grp) {
      if (!grp) return;
      const willOpen = !grp.classList.contains('open');
      grp.classList.toggle('open', willOpen);
      if (willOpen) {
        delete grp.dataset.userClosed;
      } else {
        grp.dataset.userClosed = '1';
      }
    }

    /* باز و بسته کردن زیرمنوها با کلیک روی مثلث */
    document.querySelectorAll('.wp-sub-toggle').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenuGroup(btn.closest('.wp-menu-group'));
      });
    });

    /* اسکرول فوری با یک کلیک روی عنوان‌های اصلی منوی کناری + باز/بسته شدن زیرمنو */
    document.querySelectorAll('.wp-menu-top').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href') || '';
        const grp = link.closest('.wp-menu-group');

        if (grp && grp.classList.contains('has-sub') && !document.body.classList.contains('wp-folded')) {
          toggleMenuGroup(grp);
        }

        if (href.startsWith('#')) {
          const targetEl = href === '#top' ? document.getElementById('top') : document.querySelector(href);
          if (targetEl) {
            e.preventDefault();
            if (href === '#top') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (history.replaceState) {
              history.replaceState(null, '', href);
            }
          }
        }

        document.body.classList.remove('wp-mobile-open');
      });
    });

    /* دسته‌بندی‌های سئو و دیجیتال مارکتینگ در زیرمنوی وردپرسی */
    document.querySelectorAll('[data-wp-filter-group]').forEach((subLink) => {
      subLink.addEventListener('click', () => {
        const groupId = subLink.getAttribute('data-wp-filter-group');
        const val = subLink.getAttribute('data-wp-filter-val') || 'all';
        const targetChip = document.querySelector(`#${groupId} [data-filter="${val}"]`);
        if (targetChip) targetChip.click();

        if (groupId === 'seo-domain-chips' && val !== 'all') {
          const accCard = document.querySelector(`.accordion-card[data-domain="${val}"]`);
          if (accCard && !accCard.classList.contains('open')) {
            accCard.classList.add('open');
            const hdr = accCard.querySelector('.accordion-header');
            if (hdr) hdr.setAttribute('aria-expanded', 'true');
          }
        }

        const parentSub = subLink.closest('.wp-submenu');
        if (parentSub) {
          parentSub.querySelectorAll('.wp-submenu-link').forEach((l) => l.classList.remove('current'));
        }
        subLink.classList.add('current');
        document.body.classList.remove('wp-mobile-open');
      });
    });

    /* فیلترهای بانک ابزارها در زیرمنوی وردپرسی */
    document.querySelectorAll('[data-wp-tool-mode]').forEach((subLink) => {
      subLink.addEventListener('click', () => {
        const mode = subLink.getAttribute('data-wp-tool-mode') || 'all';
        const targetChip = document.querySelector(`#tools-mode-chips [data-mode="${mode}"]`);
        if (targetChip) targetChip.click();

        const parentSub = subLink.closest('.wp-submenu');
        if (parentSub) {
          parentSub.querySelectorAll('.wp-submenu-link').forEach((l) => l.classList.remove('current'));
        }
        subLink.classList.add('current');
        document.body.classList.remove('wp-mobile-open');
      });
    });

    /* فیلتر جزئیات ۵ پلن در زیرمنوی وردپرسی */
    document.querySelectorAll('[data-wp-plan-detail]').forEach((subLink) => {
      subLink.addEventListener('click', () => {
        const planKey = subLink.getAttribute('data-wp-plan-detail') || 'all';
        const targetTab = document.querySelector(`.plan-detail-tab[data-detail-filter="${planKey}"]`);
        if (targetTab) targetTab.click();

        const parentSub = subLink.closest('.wp-submenu');
        if (parentSub) {
          parentSub.querySelectorAll('.wp-submenu-link').forEach((l) => l.classList.remove('current'));
        }
        subLink.classList.add('current');
        document.body.classList.remove('wp-mobile-open');
      });
    });

    /* بستن منوی موبایل هنگام کلیک روی سایر لینک‌های زیرمنو یا لوگوی بالای سایدبار */
    document.querySelectorAll('.wp-sidebar-brand, .wp-submenu-link:not([data-wp-filter-group]):not([data-wp-tool-mode]):not([data-wp-plan-detail])').forEach((subLink) => {
      subLink.addEventListener('click', () => {
        document.body.classList.remove('wp-mobile-open');
      });
    });

    /* دکمه «جمع کردن منو» در پایین سایدبار دسکتاپ */
    const collapseBtn = document.getElementById('wp-collapse-btn');
    if (localStorage.getItem('seo_wp_sidebar_folded') === '1') {
      document.body.classList.add('wp-folded');
    }
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        const folded = document.body.classList.toggle('wp-folded');
        localStorage.setItem('seo_wp_sidebar_folded', folded ? '1' : '0');
      });
    }

    /* باز و بسته کردن منوی کشویی موبایل / تبلت */
    const mobileToggle = document.getElementById('wp-mobile-toggle');
    const mobileBackdrop = document.getElementById('wp-sidebar-backdrop');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        document.body.classList.toggle('wp-mobile-open');
      });
    }
    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => {
        document.body.classList.remove('wp-mobile-open');
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('wp-mobile-open')) {
        document.body.classList.remove('wp-mobile-open');
      }
    });

    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    document.addEventListener('click', (e) => {
      const printPropBtn = e.target.closest('[data-action="print-proposal"]');
      if (printPropBtn) {
        syncAllVaultSlots();
        document.body.classList.remove('invoice-print-mode');
        window.print();
        return;
      }

      const printInvBtn = e.target.closest('[data-action="print-invoice"]');
      if (printInvBtn) {
        activeInvoiceDateText = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(new Date());
        syncAllVaultSlots();
        document.body.classList.add('invoice-print-mode');
        window.print();
      }
    });

    window.addEventListener('beforeprint', () => {
      if (!isTamperLocked) syncAllVaultSlots();
    });

    window.addEventListener('afterprint', () => {
      document.body.classList.remove('invoice-print-mode');
    });
  }

  /* ------------------------------------------------------------------------
   * ۵. مدیریت آکاردئون‌ها (باز/بسته کردن تکی و گروهی)
   * ------------------------------------------------------------------------ */
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach((header) => {
      header.addEventListener('click', () => {
        const card = header.closest('.accordion-card');
        if (!card) return;
        const isOpen = card.classList.toggle('open');
        header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    document.querySelectorAll('[data-expand-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-expand-target');
        const mode = btn.getAttribute('data-expand-mode');
        const container = document.getElementById(targetId);
        if (!container) return;

        container.querySelectorAll('.accordion-card').forEach((card) => {
          const shouldOpen = mode === 'open';
          card.classList.toggle('open', shouldOpen);
          const hdr = card.querySelector('.accordion-header');
          if (hdr) hdr.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
   * ۶. جستجو و فیلتر زنده در بخش اول (خدمات سئو) و بخش دوم (دیجیتال مارکتینگ)
   * ------------------------------------------------------------------------ */
  function initSeoServicesFilter() {
    const searchInput = document.getElementById('seo-search-input');
    const clearBtn = document.getElementById('seo-search-clear');
    const chips = document.querySelectorAll('#seo-domain-chips .filter-chip');
    const cards = document.querySelectorAll('#seo-domains-stack .accordion-card');
    const statusLabel = document.getElementById('seo-filter-status');

    let activeDomain = 'all';

    function applyFilter() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      if (clearBtn) clearBtn.classList.toggle('visible', query.length > 0);

      let visibleCards = 0;
      let matchedRows = 0;

      cards.forEach((card) => {
        const domainId = card.getAttribute('data-domain');
        const domainMatches = activeDomain === 'all' || domainId === activeDomain;

        if (!domainMatches) {
          card.style.display = 'none';
          return;
        }

        if (!query) {
          card.style.display = '';
          card.querySelectorAll('tbody tr, .deliverable-item').forEach((el) => {
            el.style.display = '';
          });
          visibleCards++;
          return;
        }

        const headerText = (card.querySelector('.accordion-header')?.textContent || '').toLowerCase();
        let cardHasMatch = headerText.includes(query);

        card.querySelectorAll('tbody tr').forEach((row) => {
          const match = headerText.includes(query) || row.textContent.toLowerCase().includes(query);
          row.style.display = match ? '' : 'none';
          if (match) {
            cardHasMatch = true;
            matchedRows++;
          }
        });

        card.querySelectorAll('.deliverable-item').forEach((item) => {
          const match = headerText.includes(query) || item.textContent.toLowerCase().includes(query);
          item.style.display = match ? '' : 'none';
          if (match) {
            cardHasMatch = true;
            matchedRows++;
          }
        });

        card.style.display = cardHasMatch ? '' : 'none';
        if (cardHasMatch) {
          card.classList.add('open');
          visibleCards++;
        }
      });

      if (statusLabel) {
        if (query) {
          statusLabel.textContent = `${formatFaNum(matchedRows)} مورد مرتبط در ${formatFaNum(visibleCards)} سرفصل یافت شد`;
        } else {
          statusLabel.textContent = '';
        }
      }
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeDomain = chip.getAttribute('data-filter') || 'all';
        applyFilter();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', applyFilter);
    }

    if (clearBtn && searchInput) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        applyFilter();
        searchInput.focus();
      });
    }
  }

  function initDigitalMarketingFilter() {
    const chips = document.querySelectorAll('#dm-channel-chips .filter-chip');
    const cards = document.querySelectorAll('#dm-channels-stack .accordion-card');

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter') || 'all';

        cards.forEach((card) => {
          const match = filter === 'all' || card.getAttribute('data-channel') === filter;
          card.style.display = match ? '' : 'none';
          if (filter !== 'all' && match) {
            card.classList.add('open');
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
   * ۷. کاوشگر ابزارهای تخصصی سئو (بخش سوم) + برآوردگر هزینه ابزارها
   * ------------------------------------------------------------------------ */
  function initToolsExplorer() {
    const searchInput = document.getElementById('tools-search-input');
    const categorySelect = document.getElementById('tools-category-select');
    const modeChips = document.querySelectorAll('#tools-mode-chips .filter-chip');
    const cards = document.querySelectorAll('#tools-categories-stack .accordion-card');

    const usdRateInput = document.getElementById('usd-rate-input');
    const selectedCountEl = document.getElementById('tools-selected-count');
    const totalUsdEl = document.getElementById('tools-total-usd');
    const totalTomanEl = document.getElementById('tools-total-toman');
    const clearToolsBtn = document.getElementById('clear-selected-tools');
    const presetFreeBtn = document.getElementById('preset-essential-tools');

    let activeMode = 'all'; // all | free | top5

    function filterTools() {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      const selectedCat = categorySelect ? categorySelect.value : 'all';

      cards.forEach((card) => {
        const catId = card.getAttribute('data-tool-cat');
        if (selectedCat !== 'all' && catId !== selectedCat) {
          card.style.display = 'none';
          return;
        }

        let visibleInCard = 0;
        card.querySelectorAll('tbody tr').forEach((row) => {
          const text = row.textContent.toLowerCase();
          const isFree = row.getAttribute('data-free') === 'true';
          const stars = parseInt(row.getAttribute('data-stars') || '0', 10);

          const matchesQuery = !query || text.includes(query);
          const matchesMode =
            activeMode === 'all' ||
            (activeMode === 'free' && isFree) ||
            (activeMode === 'top5' && stars === 5);

          const show = matchesQuery && matchesMode;
          row.style.display = show ? '' : 'none';
          if (show) visibleInCard++;
        });

        card.style.display = visibleInCard > 0 ? '' : 'none';
        if ((query || selectedCat !== 'all' || activeMode !== 'all') && visibleInCard > 0) {
          card.classList.add('open');
        }
      });
    }

    function updateToolCostEstimate() {
      const checks = Array.from(document.querySelectorAll('.tool-check:checked'));
      let usdSum = 0;
      checks.forEach((chk) => {
        usdSum += parseFloat(chk.getAttribute('data-usd') || '0');
      });

      const rawRate = parseFloat(toEnglishDigits(usdRateInput ? usdRateInput.value : '90000').replace(/,/g, '')) || 0;
      const tomanSum = usdSum * rawRate;

      if (selectedCountEl) selectedCountEl.textContent = `${formatFaNum(checks.length)} ابزار`;
      if (totalUsdEl) totalUsdEl.textContent = `$${usdSum.toFixed(usdSum % 1 === 0 ? 0 : 2)} / ماه`;
      if (totalTomanEl) totalTomanEl.textContent = `${formatFaNum(tomanSum)} تومان / ماه`;
    }

    if (searchInput) searchInput.addEventListener('input', filterTools);
    if (categorySelect) categorySelect.addEventListener('change', filterTools);

    modeChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        modeChips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeMode = chip.getAttribute('data-mode') || 'all';
        filterTools();
      });
    });

    document.querySelectorAll('.tool-check').forEach((chk) => {
      chk.addEventListener('change', updateToolCostEstimate);
    });

    if (usdRateInput) {
      usdRateInput.addEventListener('input', updateToolCostEstimate);
    }

    if (clearToolsBtn) {
      clearToolsBtn.addEventListener('click', () => {
        document.querySelectorAll('.tool-check').forEach((chk) => {
          chk.checked = false;
        });
        updateToolCostEstimate();
        showToast('لیست ابزارهای انتخابی پاک شد');
      });
    }

    if (presetFreeBtn) {
      presetFreeBtn.addEventListener('click', () => {
        document.querySelectorAll('.tool-check').forEach((chk) => {
          const name = (chk.getAttribute('data-tool-name') || '').toLowerCase();
          chk.checked =
            name.includes('analytics 4') ||
            name.includes('search console') ||
            name.includes('tag manager') ||
            name.includes('looker studio') ||
            name.includes('clarity') ||
            name.includes('pagespeed') ||
            name.includes('ahrefs');
        });
        updateToolCostEstimate();
        showToast('بسته پیشنهادی ابزارهای کلیدی انتخاب شد');
      });
    }

    updateToolCostEstimate();
  }

  /* ------------------------------------------------------------------------
   * ۸. مدیریت سوییچر دوره پرداخت، مشاور هوشمند انتخاب پلن و جدول مقایسه‌ای
   * ------------------------------------------------------------------------ */
  function initPricingAndPlans() {
    const billingTabs = document.querySelectorAll('.billing-tab');
    let currentCycle = 'monthly';

    function renderPricingCycle(cycle) {
      currentCycle = cycle;
      billingTabs.forEach((tab) => {
        tab.classList.toggle('active', tab.getAttribute('data-cycle') === cycle);
      });

      Object.values(PLANS_DATA).forEach((plan) => {
        const card = document.querySelector(`.plan-summary-card[data-plan="${plan.id}"]`);
        if (!card) return;

        const cycleInfo = plan.prices[cycle];
        const baseWithoutDiscount = plan.prices.monthly.total * cycleInfo.months;
        const savedAmount = baseWithoutDiscount - cycleInfo.total;
        const mainEl = card.querySelector('[data-role="price-main"]');
        const subEl = card.querySelector('[data-role="price-sub"]');

        if (mainEl) {
          const unitLabel = cycle === 'monthly' ? 'تومان / ماه' : `تومان (${CYCLE_LABELS[cycle]})`;
          mainEl.innerHTML = `${formatFaNum(cycleInfo.total)} <span>${unitLabel}</span>`;
        }

        if (subEl) {
          if (cycle === 'monthly') {
            subEl.textContent = 'شروع همکاری از یک ماه؛ بدون محدودیت حداقل مدت';
          } else {
            const perMonthEq = Math.round(cycleInfo.total / cycleInfo.months);
            subEl.textContent = `${formatFaNum(cycleInfo.discountPct)}٪ تخفیف (${formatFaNum(savedAmount)} تومان صرفه‌جویی • معادل ماهی ${formatFaNum(perMonthEq)})`;
          }
        }
      });

      document.querySelectorAll('.comparison-table tr.price-row').forEach((row) => {
        row.classList.toggle('active-cycle', row.getAttribute('data-cycle') === cycle);
      });
    }

    billingTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const cycle = tab.getAttribute('data-cycle') || 'monthly';
        renderPricingCycle(cycle);
      });
    });

    renderPricingCycle('monthly');

    /* مشاور هوشمند انتخاب پلن */
    const siteTypeSelect = document.getElementById('advisor-site-type');
    const competitionSelect = document.getElementById('advisor-competition');
    const advisorNameEl = document.getElementById('advisor-plan-name');
    const advisorReasonEl = document.getElementById('advisor-plan-reason');
    const advisorJumpBtn = document.getElementById('advisor-select-btn');

    let recommendedPlanId = 'bronze';

    function updateAdvisor() {
      const siteType = siteTypeSelect ? siteTypeSelect.value : 'startup';
      const comp = competitionSelect ? competitionSelect.value : 'low';

      if (siteType === 'shop') {
        recommendedPlanId = 'ecommerce';
      } else if (siteType === 'enterprise' || comp === 'ultra') {
        recommendedPlanId = 'diamond';
      } else if (siteType === 'large' || comp === 'high') {
        recommendedPlanId = 'diamond';
      } else if (siteType === 'startup' && comp === 'low') {
        recommendedPlanId = 'bronze';
      } else if (siteType === 'small' && comp !== 'high') {
        recommendedPlanId = 'silver';
      } else {
        recommendedPlanId = 'gold';
      }

      const plan = PLANS_DATA[recommendedPlanId];
      if (advisorNameEl) {
        advisorNameEl.textContent = `${plan.emoji} پیشنهاد هوشمند: ${plan.name}`;
      }
      if (advisorReasonEl) {
        advisorReasonEl.textContent = `شروع از ماهانه ${formatFaNum(plan.prices.monthly.total)} تومان • قابل شروع از یک ماه`;
      }

      document.querySelectorAll('.plan-summary-card').forEach((c) => {
        c.classList.toggle('recommended-pulse', c.getAttribute('data-plan') === recommendedPlanId);
      });
    }

    if (siteTypeSelect) {
      siteTypeSelect.value = 'startup';
      siteTypeSelect.addEventListener('change', updateAdvisor);
    }
    if (competitionSelect) {
      competitionSelect.value = 'low';
      competitionSelect.addEventListener('change', updateAdvisor);
    }
    if (advisorJumpBtn) {
      advisorJumpBtn.addEventListener('click', () => {
        selectPlanForInvoice(recommendedPlanId, currentCycle);
      });
    }
    updateAdvisor();

    /* فیلتر ستون‌های جدول مقایسه‌ای ۵ پلن */
    document.querySelectorAll('.col-toggle-check').forEach((chk) => {
      chk.addEventListener('change', () => {
        const checkedCount = document.querySelectorAll('.col-toggle-check:checked').length;
        if (checkedCount === 0) {
          chk.checked = true;
          showToast('حداقل یک پلن باید در جدول مقایسه‌ای نمایش داده شود');
          return;
        }
        const colKey = chk.getAttribute('data-col');
        document.querySelectorAll(`[data-plan-col="${colKey}"]`).forEach((cell) => {
          cell.classList.toggle('hidden-col', !chk.checked);
        });
      });
    });

    /* تب‌های بخش پنجم (جزئیات هر پلن) */
    const detailTabs = document.querySelectorAll('.plan-detail-tab');
    const detailCards = document.querySelectorAll('.plan-detail-card');

    detailTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        detailTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-detail-filter') || 'all';
        detailCards.forEach((card) => {
          card.style.display = target === 'all' || card.getAttribute('data-plan-detail') === target ? '' : 'none';
        });
      });
    });

    document.querySelectorAll('.plan-card-actions a[href^="#plan-detail-"]').forEach((link) => {
      link.addEventListener('click', () => {
        const allTab = document.querySelector('.plan-detail-tab[data-detail-filter="all"]');
        if (allTab) allTab.click();
        const allSub = document.querySelector('[data-wp-plan-detail="all"]');
        if (allSub) {
          allSub.closest('.wp-submenu')?.querySelectorAll('.wp-submenu-link').forEach((l) => l.classList.remove('current'));
          allSub.classList.add('current');
        }
      });
    });

    /* دکمه‌های انتخاب پلن برای پیش‌فاکتور */
    document.querySelectorAll('[data-select-plan]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const planId = btn.getAttribute('data-select-plan');
        selectPlanForInvoice(planId, currentCycle);
      });
    });
  }

  /* ------------------------------------------------------------------------
   * ۹. محاسبه‌گر هوشمند پیش‌فاکتور و زمان‌بندی اقساط قرارداد (بخش هفتم)
   * ------------------------------------------------------------------------ */
  function selectPlanForInvoice(planId, preferredCycle) {
    const planSelect = document.getElementById('calc-plan-select');
    const cycleSelect = document.getElementById('calc-cycle-select');
    const plan = PLANS_DATA[planId];
    if (!plan || !planSelect || !cycleSelect) return;

    planSelect.value = planId;

    let targetCycle = preferredCycle || cycleSelect.value;
    const chosenMonths = plan.prices[targetCycle]?.months || 1;
    if (chosenMonths < plan.minMonths) {
      targetCycle = plan.minMonths === 3 ? '3m' : plan.minMonths === 6 ? '6m' : '12m';
    }
    cycleSelect.value = targetCycle;

    planSelect.dispatchEvent(new Event('change'));

    const calcSection = document.getElementById('invoice-calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast(`${plan.name} در محاسبه‌گر پیش‌فاکتور بارگذاری شد`);
    }
  }

  function getSavedClientName() {
    try {
      const dedicated = (localStorage.getItem('seo_proposal_client_name') || '').trim();
      if (dedicated) return dedicated;
      const rawBrand = localStorage.getItem('seo_proposal_brand_v2');
      if (rawBrand) {
        const parsed = JSON.parse(rawBrand);
        if (parsed && parsed.clientName && parsed.clientName.trim()) {
          return parsed.clientName.trim();
        }
      }
    } catch (e) {
      /* ignore storage errors */
    }
    return 'کارفرمای محترم';
  }

  function applyClientName(rawVal, persist) {
    const clean = (rawVal || '').trim();
    const displayVal = clean || 'کارفرمای محترم';

    document.querySelectorAll('[data-client-display]').forEach((el) => {
      el.textContent = displayVal;
    });

    const calcInput = document.getElementById('calc-client-input');
    if (calcInput && document.activeElement !== calcInput) {
      calcInput.value = displayVal === 'کارفرمای محترم' ? '' : displayVal;
    }

    const modalInput = document.getElementById('modal-client-input');
    if (modalInput && document.activeElement !== modalInput) {
      modalInput.value = displayVal === 'کارفرمای محترم' ? '' : displayVal;
    }

    if (persist) {
      try {
        if (clean && clean !== 'کارفرمای محترم') {
          localStorage.setItem('seo_proposal_client_name', clean);
        } else {
          localStorage.removeItem('seo_proposal_client_name');
        }
        const rawBrand = localStorage.getItem('seo_proposal_brand_v2');
        if (rawBrand) {
          const parsed = JSON.parse(rawBrand);
          parsed.clientName = displayVal;
          localStorage.setItem('seo_proposal_brand_v2', JSON.stringify(parsed));
        }
      } catch (e) {
        /* ignore storage errors */
      }
    }
  }

  function initClientNameManager() {
    const backdrop = document.getElementById('client-modal-backdrop');
    const openBtns = document.querySelectorAll('[data-action="open-client-modal"]');
    const closeBtn = document.getElementById('close-client-modal-btn');
    const form = document.getElementById('client-name-form');
    const modalInput = document.getElementById('modal-client-input');
    const resetBtn = document.getElementById('reset-client-name-btn');
    const calcInput = document.getElementById('calc-client-input');

    applyClientName(getSavedClientName(), false);

    function openModal() {
      if (!backdrop) return;
      const current = getSavedClientName();
      if (modalInput) {
        modalInput.value = current === 'کارفرمای محترم' ? '' : current;
      }
      backdrop.classList.add('open');
      setTimeout(() => modalInput?.focus(), 60);
    }

    function closeModal() {
      backdrop?.classList.remove('open');
    }

    openBtns.forEach((btn) => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop?.classList.contains('open')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = modalInput ? modalInput.value.trim() : '';
        applyClientName(val, true);
        const calcPlan = document.getElementById('calc-plan-select');
        if (calcPlan) calcPlan.dispatchEvent(new Event('change'));
        closeModal();
        showToast(val ? `نام کارفرما (${val}) ثبت شد` : 'نام کارفرما به حالت پیش‌فرض بازنشانی شد');
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        applyClientName('', true);
        if (modalInput) modalInput.value = '';
        if (calcInput) calcInput.value = '';
        const calcPlan = document.getElementById('calc-plan-select');
        if (calcPlan) calcPlan.dispatchEvent(new Event('change'));
        closeModal();
        showToast('نام کارفرما به حالت پیش‌فرض بازنشانی شد');
      });
    }

    if (calcInput) {
      calcInput.addEventListener('input', () => {
        applyClientName(calcInput.value, true);
        const calcPlan = document.getElementById('calc-plan-select');
        if (calcPlan) calcPlan.dispatchEvent(new Event('change'));
      });
    }
  }

  function initInvoiceCalculator() {
    const planSelect = document.getElementById('calc-plan-select');
    const cycleSelect = document.getElementById('calc-cycle-select');
    const vatCheckbox = document.getElementById('calc-vat-check');
    const minWarningEl = document.getElementById('calc-min-warning');

    const baseAmountEl = document.getElementById('calc-base-amount');
    const discountAmountEl = document.getElementById('calc-discount-amount');
    const vatAmountEl = document.getElementById('calc-vat-amount');
    const finalTotalEl = document.getElementById('calc-final-total');
    const installmentListEl = document.getElementById('calc-installments-list');
    const copyInvoiceBtn = document.getElementById('copy-invoice-btn');

    let latestSummaryText = '';

    function recalculate() {
      const planId = planSelect ? planSelect.value : 'bronze';
      const cycle = cycleSelect ? cycleSelect.value : 'monthly';
      const includeVat = vatCheckbox ? vatCheckbox.checked : false;

      const plan = PLANS_DATA[planId];
      if (!plan) return;

      const cycleObj = plan.prices[cycle];
      const undiscounted = plan.prices.monthly.total * cycleObj.months;
      const netTotal = cycleObj.total;
      const discountVal = undiscounted - netTotal;
      const vatVal = includeVat ? Math.round(netTotal * 0.1) : 0;
      const grandTotal = netTotal + vatVal;

      if (minWarningEl) {
        const warningTextEl = minWarningEl.querySelector('[data-role="warning-text"]');
        if (plan.isHighVolume) {
          minWarningEl.style.display = 'flex';
          if (warningTextEl) {
            warningTextEl.innerHTML = `<strong>نکته زمان‌بندی «${plan.name}»:</strong> ${HIGH_VOLUME_NOTE}`;
          }
        } else {
          minWarningEl.style.display = 'none';
        }
      }

      if (baseAmountEl) baseAmountEl.textContent = `${formatFaNum(undiscounted)} تومان`;
      if (discountAmountEl) {
        discountAmountEl.textContent =
          discountVal > 0
            ? `${formatFaNum(discountVal)} تومان (${formatFaNum(cycleObj.discountPct)}٪)`
            : 'بدون تخفیف دوره';
      }
      if (vatAmountEl) {
        vatAmountEl.textContent = includeVat ? `${formatFaNum(vatVal)} تومان (۱۰٪)` : '۰ تومان (بدون احتساب)';
      }
      if (finalTotalEl) finalTotalEl.textContent = `${formatFaNum(grandTotal)} تومان`;

      const steps = INSTALLMENT_RULES[cycle] || INSTALLMENT_RULES.monthly;
      if (installmentListEl) {
        installmentListEl.innerHTML = steps
          .map((step) => {
            const stepAmount = Math.round((grandTotal * step.pct) / 100);
            return `
              <div class="installment-item">
                <span>${step.title} (${formatFaNum(step.pct)}٪)</span>
                <strong>${formatFaNum(stepAmount)} تومان</strong>
              </div>
            `;
          })
          .join('');
      }

      /* به‌روزرسانی جدول واحد پیش‌فاکتور رسمی برای نسخه چاپی */
      const setSheetText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      setSheetText('inv-sheet-date', new Intl.DateTimeFormat('fa-IR', { dateStyle: 'long' }).format(new Date()));
      setSheetText('inv-sheet-plan-title', `خدمات تخصصی سئو و بهینه‌سازی وب‌سایت — ${plan.name}`);
      const basePlanSub = `اجرای خدمات سئو و دیجیتال مارکتینگ مطابق شرح تعهدات پروپوزال (${CYCLE_LABELS[cycle]})`;
      setSheetText(
        'inv-sheet-plan-sub',
        plan.isHighVolume ? `${basePlanSub} — ${HIGH_VOLUME_NOTE}` : basePlanSub
      );
      setSheetText('inv-sheet-duration', `${formatFaNum(cycleObj.months)} ماه`);
      setSheetText('inv-sheet-unit-price', formatFaNum(plan.prices.monthly.total));
      setSheetText('inv-sheet-base-total', formatFaNum(undiscounted));
      setSheetText(
        'inv-sheet-discount',
        discountVal > 0 ? `${formatFaNum(discountVal)} (${formatFaNum(cycleObj.discountPct)}٪)` : '۰'
      );
      setSheetText('inv-sheet-net-total', formatFaNum(netTotal));
      setSheetText('inv-sheet-subtotal-foot', formatFaNum(netTotal));
      setSheetText('inv-sheet-vat-foot', includeVat ? formatFaNum(vatVal) : '۰ (بدون احتساب)');
      setSheetText('inv-sheet-grand-foot', `${formatFaNum(grandTotal)}`);
      setSheetText('inv-sheet-words', `${numberToPersianWords(grandTotal)} تومان`);
      setSheetText(
        'inv-sheet-installments',
        steps.length === 1
          ? `تسویه در ابتدای قرارداد (۱۰۰٪): ${formatFaNum(grandTotal)} تومان`
          : steps
              .map(
                (s, idx) =>
                  `قسط ${formatFaNum(idx + 1)} (${s.title} — ${formatFaNum(s.pct)}٪): ${formatFaNum(
                    Math.round((grandTotal * s.pct) / 100)
                  )} تومان`
              )
              .join('  |  ')
      );

      const brand = BRAND_INFO;
      const activeClientName = getSavedClientName();
      const summaryLines = [
        `پیش‌فاکتور تخمینی خدمات سئو — ${brand.agencyName}`,
        `کارفرما: ${activeClientName}`,
        `پلن انتخابی: ${plan.name}`,
        `دوره قرارداد: ${CYCLE_LABELS[cycle]} (شروع همکاری از یک ماه)`
      ];
      if (plan.isHighVolume) {
        summaryLines.push(`نکته زمان‌بندی: ${HIGH_VOLUME_NOTE}`);
      }
      summaryLines.push(
        `مبلغ پایه دوره: ${formatFaNum(undiscounted)} تومان`,
        `تخفیف دوره: ${formatFaNum(discountVal)} تومان (${formatFaNum(cycleObj.discountPct)}٪)`,
        `مالیات بر ارزش افزوده (۱۰٪): ${includeVat ? formatFaNum(vatVal) + ' تومان' : 'بدون احتساب'}`,
        `مبلغ نهایی قابل پرداخت: ${formatFaNum(grandTotal)} تومان`,
        `شرایط اقساط:`,
        ...steps.map(
          (s) => `- ${s.title} (${formatFaNum(s.pct)}٪): ${formatFaNum(Math.round((grandTotal * s.pct) / 100))} تومان`
        ),
        `اعتبار پیش‌فاکتور: تا ۱۲ دی ۱۴۰۵`,
        `مجری: ${brand.agencyName} (${brand.developer}) | تلفن/واتساپ: ${brand.phone} | وب‌سایت: ${brand.website}`
      );
      latestSummaryText = summaryLines.join('\n');
    }

    if (planSelect) {
      planSelect.value = 'bronze';
      planSelect.addEventListener('change', recalculate);
    }
    if (cycleSelect) {
      cycleSelect.value = 'monthly';
      cycleSelect.addEventListener('change', recalculate);
    }
    if (vatCheckbox) vatCheckbox.addEventListener('change', recalculate);

    if (copyInvoiceBtn) {
      copyInvoiceBtn.addEventListener('click', () => {
        if (navigator.clipboard && latestSummaryText) {
          navigator.clipboard.writeText(latestSummaryText).then(() => {
            showToast('متن خلاصه پیش‌فاکتور در کلیپ‌بورد کپی شد');
          });
        } else {
          showToast('امکان کپی خودکار در این مرورگر فعال نیست');
        }
      });
    }

    recalculate();
  }


  /* ------------------------------------------------------------------------
   * ۱۰. موتور تزریق هویت برند، بازگردانی خودکار DOM و تشخیص دستکاری فایل‌ها
   * ------------------------------------------------------------------------ */
  const VAULT_SLOTS_SPEC = {
    'adminbar-brand': {
      parentSelector: 'header.wp-adminbar',
      className: 'wp-adminbar-brand',
      attrs: { href: '#top' },
      render: (b) =>
        `<img class="wp-brand-logo" src="${b.logoPath}" alt="${b.logoAlt}" width="32" height="32" />` +
        `<strong>${b.agencyName}</strong>`
    },
    'adminbar-doc-title': {
      parentSelector: 'header.wp-adminbar',
      className: 'wp-adminbar-doc-title',
      attrs: { href: '#top' },
      render: (b) => `<span>📋</span><span>${b.docHeaderTitle}</span>`
    },
    'sidebar-brand': {
      parentSelector: '#wp-sidebar',
      className: 'wp-sidebar-brand',
      attrs: { href: '#top' },
      render: (b) =>
        `<img class="wp-sidebar-logo" src="${b.logoPath}" alt="${b.logoAlt}" width="40" height="40" />` +
        `<div class="wp-sidebar-brand-info"><strong>${b.agencyName}</strong><span>${b.sidebarSub}</span></div>`
    },
    'hero-brand': {
      parentSelector: '#top',
      className: 'hero-brand',
      attrs: {},
      render: (b) =>
        `<img class="hero-brand-logo" src="${b.logoPath}" alt="${b.logoAlt}" width="62" height="62" />` +
        `<div class="hero-brand-text"><strong>${b.agencyName}</strong><span>${b.agencyTagline}</span></div>`
    },
    'hero-meta': {
      parentSelector: '#top',
      className: 'hero-meta-card',
      attrs: { 'aria-label': 'شناسنامه پروپوزال' },
      render: (b, clientSafe) =>
        `<div class="hero-meta-header"><h2>${b.metaTitle}</h2><span class="status-dot">${b.validStatusBadge}</span></div>` +
        `<div class="meta-list">` +
        `<div class="meta-item"><span class="label">🏢 مجری و ارائه‌دهنده:</span><span class="value">${b.agencyPrefix} <span>${b.agencyName}</span></span></div>` +
        `<div class="meta-item"><span class="label">👤 ارائه شده به:</span><span class="value client-meta-value"><span data-client-display>${clientSafe}</span><button type="button" class="client-edit-chip no-print" data-action="open-client-modal" title="ثبت یا ویرایش نام کارفرما / شرکت">✏️ ثبت نام</button></span></div>` +
        `<div class="meta-item"><span class="label">🔢 کد رهگیری پروپوزال:</span><span class="value ltr-inline">${b.proposalCode}</span></div>` +
        `<div class="meta-item"><span class="label">📅 تاریخ تنظیم:</span><span class="value">${b.issueDate}</span></div>` +
        `<div class="meta-item"><span class="label">⏳ اعتبار پیشنهاد:</span><span class="value">${b.validShort}</span></div>` +
        `</div>`
    },
    'contact-card': {
      parentSelector: '#contact',
      className: 'terms-card',
      attrs: {},
      render: (b) =>
        `<h3>${b.contactHeading}</h3>` +
        `<div class="table-wrap"><table class="data-table">` +
        `<thead><tr><th>عنوان</th><th>اطلاعات ارتباطی</th></tr></thead>` +
        `<tbody>` +
        `<tr><td class="item-title">نام شرکت</td><td>${b.agencyName}</td></tr>` +
        `<tr><td class="item-title">توسعه‌دهنده</td><td>${b.developer}</td></tr>` +
        `<tr><td class="item-title">آدرس</td><td>${b.address}</td></tr>` +
        `<tr><td class="item-title">وب‌سایت</td><td><a href="${b.websiteUrl}" target="_blank" rel="noopener noreferrer" class="contact-link ltr-inline">${b.website}</a></td></tr>` +
        `<tr><td class="item-title">ایمیل</td><td><a href="${b.emailUrl}" target="_blank" rel="noopener noreferrer" class="contact-link ltr-inline">${b.email}</a></td></tr>` +
        `<tr><td class="item-title">تلفن</td><td><a href="${b.phoneUrl}" target="_blank" rel="noopener noreferrer" class="contact-link ltr-inline">${b.phone}</a></td></tr>` +
        `<tr><td class="item-title">واتساپ</td><td><a href="${b.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="contact-link ltr-inline">${b.whatsapp}</a></td></tr>` +
        `<tr><td class="item-title">لینکدین</td><td><a href="${b.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="contact-link ltr-inline">${b.linkedin}</a></td></tr>` +
        `<tr><td class="item-title">اینستاگرام</td><td><a href="${b.instagramUrl}" target="_blank" rel="noopener noreferrer" class="contact-link ltr-inline">${b.instagram}</a></td></tr>` +
        `</tbody></table></div>`
    },
    'validity-banner': {
      parentSelector: '#contact',
      className: 'validity-banner',
      attrs: {},
      render: (b) =>
        `<div><h3>${b.validBannerTitle}</h3><p>${b.validBannerDesc}</p></div>` +
        `<div class="nav-actions no-print"><button type="button" class="btn btn-emerald" data-action="print-proposal">🖨️ دریافت نسخه چاپی / PDF</button></div>`
    },
    'footer-brand': {
      parentSelector: 'footer.proposal-footer',
      className: 'container',
      attrs: {},
      render: (b) =>
        `<div class="footer-sign">${b.footerSignPrefix} <span>${b.agencyName}</span> • ${b.footerDate}</div>` +
        `<p class="footer-copy">${b.footerCopy}</p>`
    },
    'invoice-header': {
      parentSelector: '#official-print-invoice',
      className: 'official-inv-header',
      attrs: {},
      render: (b, clientSafe, invDateSafe) =>
        `<div class="official-inv-brand">` +
        `<img class="official-inv-logo" src="${b.logoPath}" alt="${b.logoAlt}" width="52" height="52" />` +
        `<div><h1>${b.agencyName}</h1><p class="official-inv-subtitle">${b.invSubtitle}</p>` +
        `<p class="official-inv-seller">مجری و توسعه‌دهنده: <strong>${b.developer}</strong>` +
        ` &nbsp;|&nbsp; نشانی: <strong>${b.address}</strong>` +
        ` &nbsp;|&nbsp; تلفن: <span class="ltr-inline">${b.phone}</span>` +
        ` &nbsp;|&nbsp; ایمیل: <span class="ltr-inline">${b.email}</span>` +
        ` &nbsp;|&nbsp; وب‌سایت: <span class="ltr-inline">${b.website}</span></p></div></div>` +
        `<div class="official-inv-meta">` +
        `<div><span>شماره پیش‌فاکتور:</span> <strong class="ltr-inline">${b.proposalCode}</strong></div>` +
        `<div><span>تاریخ صدور:</span> <strong id="inv-sheet-date">${invDateSafe}</strong></div>` +
        `<div><span>خریدار / کارفرما:</span> <strong data-client-display>${clientSafe}</strong></div>` +
        `<div><span>اعتبار پیش‌فاکتور:</span> <strong>${b.validShort}</strong></div>` +
        `</div>`
    },
    'invoice-signatures': {
      parentSelector: '#official-print-invoice',
      className: 'official-inv-signatures',
      attrs: {},
      render: (b, clientSafe) =>
        `<div class="inv-sign-box"><strong>مهر و امضای صادرکننده (مجری)</strong><span>${b.agencyName}</span></div>` +
        `<div class="inv-sign-box"><strong>مهر و امضای تأییدکننده (کارفرما)</strong><span data-client-display>${clientSafe}</span></div>`
    }
  };

  function syncAllVaultSlots() {
    if (isTamperLocked) return false;
    if (!BRAND_INFO) {
      triggerTamperLock();
      return false;
    }

    isVaultSyncing = true;
    try {
      const clientPlain = getSavedClientName();
      const clientSafe = escapeHtml(clientPlain);
      const invDateSafe = escapeHtml(activeInvoiceDateText || BRAND_INFO.invoiceIssueDateDefault);

      if (document.title !== BRAND_INFO.pageTitle) {
        document.title = BRAND_INFO.pageTitle;
      }
      const fav = document.getElementById('vault-favicon');
      if (fav && fav.getAttribute('href') !== BRAND_INFO.logoPath) {
        fav.setAttribute('href', BRAND_INFO.logoPath);
      }
      const touchIcon = document.getElementById('vault-touch-icon');
      if (touchIcon && touchIcon.getAttribute('href') !== BRAND_INFO.logoPath) {
        touchIcon.setAttribute('href', BRAND_INFO.logoPath);
      }

      /* پاکسازی استایل‌های مخفی‌سازی احتمالی روی کانتینرهای والد */
      ['header.wp-adminbar', '#wp-sidebar', '#top', '#contact', 'footer.proposal-footer', '#official-print-invoice'].forEach(
        (sel) => {
          const parentEl = document.querySelector(sel);
          if (!parentEl) {
            triggerTamperLock();
            return;
          }
          if (parentEl.hasAttribute('style')) parentEl.removeAttribute('style');
          if (parentEl.hasAttribute('hidden')) parentEl.removeAttribute('hidden');
        }
      );
      if (isTamperLocked) return false;

      /* حذف المان‌های غیرمجاز احتمالی اضافه‌شده به فوتر یا برگه پیش‌فاکتور */
      const footerEl = document.querySelector('footer.proposal-footer');
      if (footerEl) {
        Array.from(footerEl.children).forEach((ch) => {
          if (ch.getAttribute('data-vault-slot') !== 'footer-brand') ch.remove();
        });
      }
      const invSec = document.getElementById('official-print-invoice');
      if (invSec) {
        Array.from(invSec.children).forEach((ch) => {
          const slot = ch.getAttribute('data-vault-slot');
          const allowed =
            slot === 'invoice-header' ||
            slot === 'invoice-signatures' ||
            ch.classList.contains('official-inv-table') ||
            ch.classList.contains('official-inv-note');
          if (!allowed) ch.remove();
        });
      }

      /* بررسی وجود یکتای تمامی اسلات‌ها و بازگردانی دقیق محتوای آن‌ها */
      for (const [slotKey, spec] of Object.entries(VAULT_SLOTS_SPEC)) {
        const matches = document.querySelectorAll(`[data-vault-slot="${slotKey}"]`);
        if (matches.length !== 1) {
          triggerTamperLock();
          return false;
        }
        const el = matches[0];
        if (!el.closest(spec.parentSelector)) {
          triggerTamperLock();
          return false;
        }
        if (el.className !== spec.className) {
          el.className = spec.className;
        }
        if (el.hasAttribute('style')) el.removeAttribute('style');
        if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
        for (const [attrName, attrVal] of Object.entries(spec.attrs)) {
          if (el.getAttribute(attrName) !== attrVal) {
            el.setAttribute(attrName, attrVal);
          }
        }
        const expectedHtml = spec.render(BRAND_INFO, clientSafe, invDateSafe);
        if (el.innerHTML !== expectedHtml) {
          el.innerHTML = expectedHtml;
        }
      }

      /* همگام‌سازی نمایش نام کارفرما در دکمه هدر بالا */
      const topBarClient = document.querySelector('.wp-adminbar-client [data-client-display]');
      if (topBarClient && topBarClient.textContent !== clientPlain) {
        topBarClient.textContent = clientPlain;
      }

      if (vaultObserver) {
        vaultObserver.takeRecords();
      }
      return true;
    } finally {
      isVaultSyncing = false;
    }
  }

  function verifyLogoIntegrity() {
    if (isTamperLocked || !BRAND_INFO) return;

    const probe = new Image();
    probe.onload = () => {
      if (probe.naturalWidth !== BRAND_INFO.logoDim || probe.naturalHeight !== BRAND_INFO.logoDim) {
        triggerTamperLock();
      }
    };
    probe.onerror = () => {
      triggerTamperLock();
    };
    probe.src = BRAND_INFO.logoPath;

    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      fetch(BRAND_INFO.logoPath, { cache: 'no-store' })
        .then((res) => {
          if (!res.ok) {
            triggerTamperLock();
            return null;
          }
          return res.arrayBuffer();
        })
        .then((buf) => {
          if (!buf) return;
          const bytes = new Uint8Array(buf);
          if (bytes.byteLength !== BRAND_INFO.logoSizeBytes || fnv1a32(bytes) !== BRAND_INFO.logoHash) {
            triggerTamperLock();
          }
        })
        .catch(() => {
          /* خطای شبکه موقت نادیده گرفته می‌شود؛ بررسی ابعاد تصویر همچنان فعال است */
        });
    }
  }

  function initBrandVaultGuard() {
    if (!BRAND_INFO) {
      triggerTamperLock();
      return false;
    }
    const ok = syncAllVaultSlots();
    if (!ok || isTamperLocked) return false;

    document.documentElement.setAttribute('data-vault-ready', '1');
    verifyLogoIntegrity();

    vaultObserver = new MutationObserver((mutations) => {
      if (isTamperLocked || isVaultSyncing) return;
      let needsSync = false;
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        const t = m.target.nodeType === 1 ? m.target : m.target.parentElement;
        if (!t) continue;
        if (t.id === 'term-tooltip-pop' || (t.classList && t.classList.contains('term-tip-btn'))) {
          continue;
        }
        if (
          t === document.documentElement ||
          t === document.head ||
          t.tagName === 'TITLE' ||
          t.id === 'vault-favicon' ||
          t.id === 'vault-touch-icon' ||
          t.closest('[data-vault-slot]') ||
          t.matches('header.wp-adminbar, #wp-sidebar, #top, #contact, footer.proposal-footer, #official-print-invoice') ||
          m.type === 'childList'
        ) {
          needsSync = true;
          break;
        }
      }
      if (needsSync) {
        if (document.documentElement.getAttribute('data-vault-ready') !== '1' && !isTamperLocked) {
          document.documentElement.setAttribute('data-vault-ready', '1');
        }
        syncAllVaultSlots();
      }
    });

    vaultObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'href', 'src', 'hidden', 'data-vault-slot', 'data-vault-ready']
    });

    vaultHeartbeatTimer = setInterval(() => {
      if (!isTamperLocked) {
        if (document.documentElement.getAttribute('data-vault-ready') !== '1') {
          document.documentElement.setAttribute('data-vault-ready', '1');
        }
        syncAllVaultSlots();
      }
    }, 1800);

    return true;
  }

  /* ------------------------------------------------------------------------
   * ۱۱. تولتیپ مینیمال با کلیک روی علامت سؤال (؟) برای اصطلاحات تخصصی
   * ------------------------------------------------------------------------ */
  function initTermTooltips() {
    const pop = document.getElementById('term-tooltip-pop');
    if (!pop) return;

    let activeTrigger = null;

    function closeTip() {
      if (activeTrigger) {
        activeTrigger.classList.remove('active');
        activeTrigger = null;
      }
      pop.classList.remove('open');
      pop.setAttribute('aria-hidden', 'true');
    }

    function openTip(btn) {
      const text = (btn.getAttribute('data-tip') || '').trim();
      if (!text) return;

      if (activeTrigger === btn && pop.classList.contains('open')) {
        closeTip();
        return;
      }

      if (activeTrigger) activeTrigger.classList.remove('active');
      activeTrigger = btn;
      btn.classList.add('active');

      pop.textContent = text;
      pop.classList.add('open');
      pop.setAttribute('aria-hidden', 'false');

      const rect = btn.getBoundingClientRect();
      const popRect = pop.getBoundingClientRect();
      const margin = 12;

      let top = rect.top - popRect.height - 8;
      if (top < 62) {
        top = rect.bottom + 8;
      }

      let left = rect.left + rect.width / 2 - popRect.width / 2;
      if (left < margin) left = margin;
      if (left + popRect.width > window.innerWidth - margin) {
        left = Math.max(margin, window.innerWidth - popRect.width - margin);
      }

      pop.style.top = `${Math.round(top)}px`;
      pop.style.left = `${Math.round(left)}px`;
    }

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.term-tip-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        openTip(btn);
        return;
      }
      if (pop.classList.contains('open') && !e.target.closest('#term-tooltip-pop')) {
        closeTip();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pop.classList.contains('open')) {
        closeTip();
        return;
      }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('term-tip-btn')) {
        e.preventDefault();
        e.stopPropagation();
        openTip(e.target);
      }
    });

    window.addEventListener(
      'scroll',
      () => {
        if (pop.classList.contains('open')) closeTip();
      },
      { passive: true }
    );

    window.addEventListener('resize', () => {
      if (pop.classList.contains('open')) closeTip();
    });
  }

  /* ------------------------------------------------------------------------
   * راه‌اندازی کلی برنامه پس از بارگذاری DOM
   * ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    if (!initBrandVaultGuard()) return;
    initTheme();
    initScrollFeatures();
    initAccordions();
    initSeoServicesFilter();
    initDigitalMarketingFilter();
    initToolsExplorer();
    initPricingAndPlans();
    initInvoiceCalculator();
    initClientNameManager();
    initTermTooltips();
  });
})();
