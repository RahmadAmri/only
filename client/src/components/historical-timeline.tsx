"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import styles from "./historical-timeline.module.scss";

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}
interface TimePeriod {
  id: number;
  category: string;
  startYear: number;
  endYear: number;
  events: TimelineEvent[];
}

const timelineData: TimePeriod[] = [
  {
    id: 1,
    category: "Технологии",
    startYear: 1980,
    endYear: 1986,
    events: [
      {
        year: 1981,
        title: "IBM PC",
        description: "Выпуск первого персонального компьютера IBM",
      },
      {
        year: 1983,
        title: "Интернет",
        description: "Появление протокола TCP/IP",
      },
      {
        year: 1984,
        title: "Apple Macintosh",
        description: "Революция в пользовательском интерфейсе",
      },
      {
        year: 1985,
        title: "Windows 1.0",
        description: "Первая версия операционной системы Windows",
      },
    ],
  },
  {
    id: 2,
    category: "Кино",
    startYear: 1987,
    endYear: 1991,
    events: [
      {
        year: 1987,
        title: "«Хищник»/Predator, США (реж. Джон Мактирнан)",
        description: "Научно-фантастический боевик с Арнольдом Шварценеггером",
      },
      {
        year: 1988,
        title:
          "«Кто подставил кролика Роджера»/Who Framed Roger Rabbit, США (реж. Роберт Земекис)",
        description: "Инновационное сочетание анимации и игрового кино",
      },
      {
        year: 1989,
        title:
          "«Назад в будущее 2»/Back To The Future 2, США (реж. Роберт Земекис)",
        description: "Продолжение культовой фантастической трилогии",
      },
      {
        year: 1990,
        title: "«Крепкий орешек 2»/Die Hard 2, США (реж. Ренни Харлин)",
        description: "Продолжение боевика с Брюсом Уиллисом",
      },
    ],
  },
  {
    id: 3,
    category: "Литература",
    startYear: 1992,
    endYear: 1997,
    events: [
      {
        year: 1992,
        title: "Нобелевская премия по литературе — Дерек Уолкотт",
        description: "Признание творчества карибского поэта",
      },
      {
        year: 1994,
        title: "«Бессонница» — роман Стивена Кинга",
        description: "Мистический триллер о борьбе добра и зла",
      },
      {
        year: 1995,
        title: "Нобелевская премия по литературе — Шеймас Хини",
        description: "Ирландский поэт, лауреат Нобелевской премии",
      },
      {
        year: 1997,
        title: "«Гарри Поттер и философский камень» — Джоан Роулинг",
        description: "Начало знаменитой серии о юном волшебнике",
      },
    ],
  },
  {
    id: 4,
    category: "Наука",
    startYear: 1998,
    endYear: 2003,
    events: [
      {
        year: 1998,
        title: "Международная космическая станция",
        description: "Начало строительства МКС",
      },
      {
        year: 2000,
        title: "Расшифровка генома человека",
        description: "Завершение проекта «Геном человека»",
      },
      {
        year: 2001,
        title: "Википедия",
        description: "Запуск свободной энциклопедии",
      },
      {
        year: 2003,
        title: "Социальные сети",
        description: "Появление первых социальных сетей",
      },
    ],
  },
  {
    id: 5,
    category: "Спорт",
    startYear: 2004,
    endYear: 2009,
    events: [
      {
        year: 2004,
        title: "Олимпиада в Афинах",
        description: "Летние Олимпийские игры в Греции",
      },
      {
        year: 2006,
        title: "Чемпионат мира по футболу",
        description: "Германия принимает чемпионат мира",
      },
      {
        year: 2008,
        title: "Олимпиада в Пекине",
        description: "Грандиозные Олимпийские игры в Китае",
      },
      {
        year: 2009,
        title: "Усэйн Болт",
        description: "Установление мировых рекордов в беге",
      },
    ],
  },
  {
    id: 6,
    category: "Искусство",
    startYear: 2010,
    endYear: 2015,
    events: [
      {
        year: 2010,
        title: "Цифровое искусство",
        description: "Развитие NFT и цифрового творчества",
      },
      {
        year: 2012,
        title: "Стрит-арт",
        description: "Признание уличного искусства",
      },
      {
        year: 2014,
        title: "Виртуальная реальность",
        description: "Новые формы художественного выражения",
      },
      {
        year: 2015,
        title: "Интерактивные инсталляции",
        description: "Развитие интерактивного искусства",
      },
    ],
  },
];

export default function HistoricalTimeline() {
  const [activePeriod, setActivePeriod] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const yearsRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLButtonElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // Horizontal scroll refs / state
  const eventScrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const currentPeriod = timelineData[activePeriod];
  const totalPeriods = timelineData.length;

  // Circle layout
  const circleDiameter = 530;
  const buttonSize = 56;
  const radius = circleDiameter / 2 - buttonSize / 2;

  const layoutButtons = (activeIndex: number, animate = false) => {
    if (!circleRef.current) return;
    const buttons = circleRef.current.querySelectorAll(
      `.${styles.circleButton}`
    );
    const total = totalPeriods;
    buttons.forEach((button, i) => {
      const relative = (i - activeIndex + total) % total;
      const angle = (360 / total) * relative - 90;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;
      if (animate) {
        gsap.to(button, { x, y, duration: 1, ease: "power3.inOut" });
      } else {
        gsap.set(button, { x, y });
      }
    });
  };

  // Initial circle buttons
  useEffect(() => {
    layoutButtons(activePeriod, false);
    if (!circleRef.current) return;
    const buttons = circleRef.current.querySelectorAll(
      `.${styles.circleButton}`
    );
    gsap.fromTo(
      buttons,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "back.out(1.6)",
      }
    );
  }, []);

  // Animate years on period change
  useEffect(() => {
    if (!yearsRef.current) return;
    setIsAnimating(true);
    gsap.fromTo(
      yearsRef.current.children,
      { opacity: 0, y: 30, scale: 0.85 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.4)",
        stagger: 0.15,
        onComplete: () => setIsAnimating(false),
      }
    );
  }, [activePeriod]);

  // Animate events list & reset scroll when period changes
  useEffect(() => {
    const el = eventScrollRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    const cards = el.querySelectorAll(`.${styles.eventCard}`);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }
    );
    // Update arrow state after resetting scroll
    requestAnimationFrame(() => updateEventArrows());
  }, [activePeriod]);

  // Period change handlers
  const handlePeriodChange = (index: number) => {
    if (index === activePeriod || isAnimating) return;
    setActivePeriod(index);
    layoutButtons(index, true);
  };
  const handlePrev = () =>
    handlePeriodChange(
      activePeriod === 0 ? totalPeriods - 1 : activePeriod - 1
    );
  const handleNext = () =>
    handlePeriodChange(
      activePeriod === totalPeriods - 1 ? 0 : activePeriod + 1
    );

  // Horizontal scroll helpers
  const updateEventArrows = useCallback(() => {
    const el = eventScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 0);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateEventArrows();
    const el = eventScrollRef.current;
    if (!el) return;
    const onScroll = () => updateEventArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateEventArrows);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateEventArrows);
    };
  }, [updateEventArrows, activePeriod]);

  const scrollAmount = () => {
    const el = eventScrollRef.current;
    if (!el) return 0;
    return Math.min(el.clientWidth * 0.9, el.scrollWidth - el.clientWidth);
  };
  const scrollNext = () => {
    const el = eventScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  };
  const scrollPrev = () => {
    const el = eventScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  };

  // Drag / swipe (mouse)
  useEffect(() => {
    const el = eventScrollRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    const down = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX;
      startScroll = el.scrollLeft;
      el.classList.add(styles.dragging);
    };
    const move = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      el.scrollLeft = startScroll - dx;
    };
    const up = () => {
      isDown = false;
      el.classList.remove(styles.dragging);
    };
    el.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      el.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [activePeriod]);

  return (
    <section className={styles.historicalTimeline}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <div className={styles.gradientLine} />
            <h1 className={styles.title}>
              Исторические
              <br />
              даты
            </h1>
          </div>
          <div className={styles.category}>
            <span className={styles.categoryNumber}>
              {String(activePeriod + 1).padStart(2, "0")}
            </span>
            <span className={styles.categoryText}>
              {currentPeriod.category}
            </span>
          </div>
        </div>

        {/* Circle */}
        <div className={styles.circleContainer}>
          <div ref={circleRef} className={styles.circle}>
            <div className={styles.circleBorder} />
            {timelineData.map((period, i) => (
              <button
                key={period.id}
                className={`${styles.circleButton} ${
                  i === activePeriod ? styles.active : ""
                }`}
                aria-label={`${i + 1}. ${period.category}`}
                onClick={() => handlePeriodChange(i)}
              >
                <span
                  className={styles.circleButtonNumber}
                  style={{ top: "50%", position: "absolute" }}
                >
                  {i + 1}
                </span>
                <span className={styles.circleButtonLabel}>
                  {period.category}
                </span>
              </button>
            ))}
          </div>
          <div className={styles.years} ref={yearsRef}>
            <div className={`${styles.year} ${styles.yearStart}`}>
              {currentPeriod.startYear}
            </div>
            <div className={`${styles.year} ${styles.yearEnd}`}>
              {currentPeriod.endYear}
            </div>
          </div>
        </div>

        {/* Period nav (counter with arrows directly beneath, like screenshot) */}
        <div className={styles.periodNav}>
          <div className={styles.periodCounter}>
            <span className={styles.paginationCurrent}>
              {String(activePeriod + 1).padStart(2, "0")}
            </span>
            <span className={styles.paginationSeparator}>/</span>
            <span className={styles.paginationTotal}>
              {String(totalPeriods).padStart(2, "0")}
            </span>
          </div>
          <div className={styles.periodArrows}>
            <button
              ref={prevBtnRef}
              className={styles.navButton}
              onClick={handlePrev}
              disabled={isAnimating}
              aria-label="Предыдущий период"
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <path
                  d="M8.5.75 2.25 7 8.5 13.25"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
            <button
              ref={nextBtnRef}
              className={styles.navButton}
              onClick={handleNext}
              disabled={isAnimating}
              aria-label="Следующий период"
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <path
                  d="M1.5.75 7.75 7 1.5 13.25"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Events horizontal scroll */}
        <div className={styles.events}>
          <div className={styles.eventScrollWrapper}>
            <button
              type="button"
              className={`${styles.eventArrow} ${styles.eventArrowPrev}`}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Назад"
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <path
                  d="M8.5.75 2.25 7 8.5 13.25"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>

            <div
              ref={eventScrollRef}
              className={styles.eventScroller}
              role="list"
            >
              <div className={styles.eventTrack}>
                {currentPeriod.events.map((ev) => (
                  <div
                    key={ev.year}
                    className={styles.eventCard}
                    role="listitem"
                  >
                    <div className={styles.eventYear}>{ev.year}</div>
                    <h4 className={styles.eventTitle}>{ev.title}</h4>
                    {ev.description && (
                      <p className={styles.eventDescription}>
                        {ev.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              className={`${styles.eventArrow} ${styles.eventArrowNext}`}
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Вперед"
            >
              <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
                <path
                  d="M1.5.75 7.75 7 1.5 13.25"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
