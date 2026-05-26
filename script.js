const counters = document.querySelectorAll('[data-counter]');
const progressBars = document.querySelectorAll('[data-progress]');
const circleProgressItems = document.querySelectorAll('[data-circle-progress]');
const animatedCards = document.querySelectorAll(
  '.stat-card, .card, .team-card',
);
const timelines = document.querySelectorAll('.timeline');

function animateCounter(element) {
  const target = Number(element.dataset.counter);
  const suffix = element.dataset.suffix || '';
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.round(target * progress);

    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function animateProgressBar(element) {
  element.style.width = `${element.dataset.progress}%`;
}

function animateCircleProgress(element) {
  const target = Number(element.dataset.circleProgress);
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = target * progress;

    element.style.setProperty('--progress', `${value}%`);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function handleIntersection(entries, observerInstance) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const element = entry.target;

    if (element.matches('.stat-card, .card, .team-card, .timeline')) {
      element.classList.add('is-visible');
    }

    if (element.dataset.counter) {
      animateCounter(element);
    }

    if (element.dataset.progress) {
      animateProgressBar(element);
    }

    if (element.dataset.circleProgress) {
      animateCircleProgress(element);
    }

    observerInstance.unobserve(element);
  });
}

const observer = new IntersectionObserver(handleIntersection, {
  threshold: 0.2,
});

animatedCards.forEach((card) => {
  observer.observe(card);
});

counters.forEach((counter) => {
  observer.observe(counter);
});

progressBars.forEach((bar) => {
  observer.observe(bar);
});

circleProgressItems.forEach((item) => {
  observer.observe(item);
});

timelines.forEach((timeline) => {
  observer.observe(timeline);
});

/* -------------------- */
/* WORKLOAD CHART */
/* -------------------- */

const workloadChart = document.querySelector('#workloadChart');

if (workloadChart) {
  const workloadData = {
    labels: ['ЛК', 'Дизайн-система', 'ВП', 'КД', 'Подписание', 'Сайт', 'ДС'],

    datasets: [
      {
        label: 'Закрыта',
        data: [117, 61, 53, 38, 8, 7, 7],
        backgroundColor: 'rgba(34,227,181,.85)',
      },
      {
        label: 'В работе',
        data: [1, 7, 3, 1, 0, 1, 0],
        backgroundColor: 'rgba(255,193,92,.75)',
      },
      {
        label: 'Открыта / запланирована',
        data: [8, 45, 4, 3, 1, 1, 1],
        backgroundColor: 'rgba(139,124,255,.75)',
      },
    ],
  };

  new Chart(workloadChart, {
    type: 'bar',
    data: workloadData,

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: 'nearest',
        intersect: true,
      },

      plugins: {
        legend: {
          position: 'bottom',

          labels: {
            color: '#a6afc2',
            boxWidth: 12,
            boxHeight: 12,
            padding: 20,
          },
        },

        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,.08)',
          borderWidth: 1,

          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.raw} задач`;
            },
          },
        },
      },

      scales: {
        x: {
          stacked: true,

          ticks: {
            color: '#a6afc2',
          },

          grid: {
            display: false,
          },
        },

        y: {
          stacked: true,
          beginAtZero: true,

          ticks: {
            color: '#a6afc2',
          },

          grid: {
            color: 'rgba(255,255,255,.05)',
          },
        },
      },
    },
  });
}
