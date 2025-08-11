"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { gsap } from "gsap";
import "swiper/css";
import "swiper/css/navigation";
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

  const currentPeriod = timelineData[activePeriod];
  const totalPeriods = timelineData.length;

  const layoutButtons = (activeIndex: number, animate = false) => {
    if (!circleRef.current) return;
    const buttons = circleRef.current.querySelectorAll(
      `.${styles.circleButton}`
    );
    const total = totalPeriods;
    const radius = 265;
    buttons.forEach((button, i) => {
      const relative = (i - activeIndex + total) % total; // active goes to top
      const angle = (360 / total) * relative - 90; // -90 so active at top
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;
      if (animate) {
        gsap.to(button, { x, y, duration: 1, ease: "power3.inOut" });
      } else {
        gsap.set(button, { x, y });
      }
      // counter-rotate text to keep horizontal only for category text
      const textEl = (button as HTMLElement).querySelector(
        `.${styles.circleButtonText}`
      );
      if (textEl) {
        gsap.set(textEl, { rotation: -0 }); // ensure reset
      }
    });
  };

  // Position buttons on circle (initial)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate years on change
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

  const handlePeriodChange = (index: number) => {
    if (index === activePeriod || isAnimating) return;
    setActivePeriod(index);
    layoutButtons(index, true);
  };

  const handlePrev = () => {
    handlePeriodChange(
      activePeriod === 0 ? totalPeriods - 1 : activePeriod - 1
    );
  };
  const handleNext = () => {
    handlePeriodChange(
      activePeriod === totalPeriods - 1 ? 0 : activePeriod + 1
    );
  };

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
          <div className={styles.circle} ref={circleRef}>
            <div className={styles.circleBorder} />
            {/* crosshair lines */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                width: "100%",
                height: 1,
                background: "rgba(66,86,122,0.15)",
                transform: "translateY(-50%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                height: "100%",
                width: 1,
                background: "rgba(66,86,122,0.15)",
                transform: "translateX(-50%)",
              }}
            />
            {timelineData.map((period, index) => (
              <button
                key={period.id}
                className={`${styles.circleButton} ${
                  index === activePeriod ? "active" : ""
                }`}
                onClick={() => handlePeriodChange(index)}
                aria-label={`Период ${period.category}`}
              >
                <span className={styles.circleButtonNumber}>{index + 1}</span>
                <span className={styles.circleButtonText}>
                  {period.category}
                </span>
              </button>
            ))}
          </div>
          {/* Years */}
          <div className={styles.years} ref={yearsRef}>
            <div className={`${styles.year} ${styles.yearStart}`}>
              {currentPeriod.startYear}
            </div>
            <div className={`${styles.year} ${styles.yearEnd}`}>
              {currentPeriod.endYear}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.pagination}>
            <span className={styles.paginationCurrent}>
              {String(activePeriod + 1).padStart(2, "0")}
            </span>
            <span className={styles.paginationSeparator}>/</span>
            <span className={styles.paginationTotal}>
              {String(totalPeriods).padStart(2, "0")}
            </span>
          </div>
          <div className={styles.nav}>
            <button
              ref={prevBtnRef}
              className={`${styles.navButton} timeline-prev`}
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
              className={`${styles.navButton} timeline-next`}
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

        {/* Events */}
        <div className={styles.events}>
          <Swiper
            modules={[Navigation]}
            spaceBetween={80}
            slidesPerView={"auto"}
            onBeforeInit={(swiper) => {
              // Provide navigation elements after refs available
              // @ts-expect-error Swiper types don't know about dynamic assignment before init
              swiper.params.navigation.prevEl = prevBtnRef.current;
              // @ts-expect-error Swiper types don't know about dynamic assignment before init
              swiper.params.navigation.nextEl = nextBtnRef.current;
            }}
            navigation={{
              prevEl: prevBtnRef.current,
              nextEl: nextBtnRef.current,
            }}
            key={activePeriod} // re-init when period changes
            className={styles.swiper}
          >
            {currentPeriod.events.map((event, i) => (
              <SwiperSlide
                key={`${activePeriod}-${i}`}
                className={styles.slide}
              >
                <div className={styles.event}>
                  <div className={styles.eventYear}>{event.year}</div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDescription}>{event.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
