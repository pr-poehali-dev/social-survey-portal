import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useYandexAuth } from '@/components/extensions/yandex-auth/useYandexAuth';
import { YandexLoginButton } from '@/components/extensions/yandex-auth/YandexLoginButton';
import { UserProfile } from '@/components/extensions/yandex-auth/UserProfile';

const AUTH_URL = "https://functions.poehali.dev/38579c8f-0969-4569-8dfe-d5b86b2ebd28";

const apiUrls = {
  authUrl: `${AUTH_URL}?action=auth-url`,
  callback: `${AUTH_URL}?action=callback`,
  refresh: `${AUTH_URL}?action=refresh`,
  logout: `${AUTH_URL}?action=logout`,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const auth = useYandexAuth({ apiUrls });
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    if (showProfile) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  const polls = [
    {
      id: 1,
      title: 'Лучший язык программирования 2026',
      description: 'Выберите язык программирования, который считаете наиболее перспективным',
      votes: 2847,
      category: 'Технологии',
      active: true,
    },
    {
      id: 2,
      title: 'Предпочтения в удаленной работе',
      description: 'Как вы относитесь к гибридному формату работы?',
      votes: 1523,
      category: 'Карьера',
      active: true,
    },
    {
      id: 3,
      title: 'Экологические инициативы в городе',
      description: 'Какие меры по защите окружающей среды вы поддерживаете?',
      votes: 3291,
      category: 'Общество',
      active: true,
    },
  ];

  const results = [
    {
      question: 'Любимый язык программирования',
      options: [
        { name: 'Python', votes: 1205, percentage: 42 },
        { name: 'JavaScript', votes: 892, percentage: 31 },
        { name: 'Rust', votes: 485, percentage: 17 },
        { name: 'Go', votes: 265, percentage: 10 },
      ],
      totalVotes: 2847,
    },
    {
      question: 'Формат работы',
      options: [
        { name: 'Гибрид (офис + удаленка)', votes: 762, percentage: 50 },
        { name: 'Только удаленно', votes: 457, percentage: 30 },
        { name: 'Только офис', votes: 304, percentage: 20 },
      ],
      totalVotes: 1523,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl gradient-purple-pink flex items-center justify-center">
              <Icon name="BarChart3" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold gradient-text">PollHub</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === 'polls' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Опросы
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                activeTab === 'results' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Результаты
            </button>
          </div>
          <div className="flex items-center gap-3">
            {auth.isAuthenticated && auth.user ? (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  {auth.user.avatar_url ? (
                    <img src={auth.user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#FC3F1D] flex items-center justify-center text-white text-xs font-bold">
                      {auth.user.name ? auth.user.name[0].toUpperCase() : 'Я'}
                    </div>
                  )}
                  <span className="hidden md:inline">{auth.user.name || 'Профиль'}</span>
                  <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
                </button>
                {showProfile && (
                  <div className="absolute top-12 right-0 z-50 w-72">
                    <UserProfile user={auth.user} onLogout={async () => { await auth.logout(); setShowProfile(false); }} isLoading={auth.isLoading} />
                  </div>
                )}
              </div>
            ) : (
              <YandexLoginButton onClick={auth.login} isLoading={auth.isLoading} />
            )}
            <Button className="gradient-purple-pink border-0">
              <Icon name="Plus" size={18} className="mr-2" />
              Создать опрос
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <section className="text-center space-y-6 py-12">
              {auth.isAuthenticated && auth.user && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary animate-fade-in">
                  <Icon name="CheckCircle" size={16} />
                  Добро пожаловать, {auth.user.name?.split(' ')[0] || 'пользователь'}!
                </div>
              )}
              <div className="inline-block">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 animate-slide-up">
                  Узнайте мнение <br />
                  <span className="gradient-text">миллионов людей</span>
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                Создавайте опросы, собирайте данные и анализируйте результаты в режиме реального времени
              </p>
              <div className="flex items-center justify-center gap-4 pt-4 animate-slide-up">
                <Button size="lg" className="gradient-purple-pink border-0 text-lg px-8">
                  Начать опрос
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
                {!auth.isAuthenticated && (
                  <Button size="lg" variant="outline" className="text-lg px-8" onClick={auth.login}>
                    Войти через Яндекс
                  </Button>
                )}
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-purple-pink flex items-center justify-center mb-4">
                    <Icon name="Users" className="text-white" size={24} />
                  </div>
                  <CardTitle>Быстрые опросы</CardTitle>
                  <CardDescription>
                    Создавайте опросы за минуты с готовыми шаблонами и интуитивным интерфейсом
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-purple-blue flex items-center justify-center mb-4">
                    <Icon name="TrendingUp" className="text-white" size={24} />
                  </div>
                  <CardTitle>Аналитика в реальном времени</CardTitle>
                  <CardDescription>
                    Отслеживайте результаты мгновенно с интерактивными графиками и диаграммами
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg gradient-purple-pink flex items-center justify-center mb-4">
                    <Icon name="Share2" className="text-white" size={24} />
                  </div>
                  <CardTitle>Простая публикация</CardTitle>
                  <CardDescription>
                    Делитесь опросами в соцсетях одним кликом и получайте больше ответов
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Популярные опросы</h2>
                  <p className="text-muted-foreground">Присоединяйтесь к активным обсуждениям</p>
                </div>
                <Button variant="ghost" onClick={() => setActiveTab('polls')}>
                  Смотреть все
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {polls.slice(0, 3).map((poll) => (
                  <Card
                    key={poll.id}
                    className="border-border/40 bg-card/50 backdrop-blur hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
                          {poll.category}
                        </span>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Icon name="Users" size={14} className="mr-1" />
                          {poll.votes.toLocaleString()}
                        </div>
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {poll.title}
                      </CardTitle>
                      <CardDescription>{poll.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full gradient-purple-pink border-0">
                        Пройти опрос
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'polls' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2">Активные опросы</h1>
              <p className="text-muted-foreground text-lg">
                Выберите опрос и поделитесь своим мнением
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="default" className="gradient-purple-pink border-0">
                Все категории
              </Button>
              <Button variant="outline">Технологии</Button>
              <Button variant="outline">Карьера</Button>
              <Button variant="outline">Общество</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {polls.map((poll) => (
                <Card
                  key={poll.id}
                  className="border-border/40 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:scale-[1.02]"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary font-medium">
                        {poll.category}
                      </span>
                      {poll.active && (
                        <div className="flex items-center text-green-400 text-sm">
                          <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                          Активен
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{poll.title}</CardTitle>
                    <CardDescription className="text-base">{poll.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Icon name="Users" size={16} className="mr-2" />
                        <span>{poll.votes.toLocaleString()} участников</span>
                      </div>
                      <div className="flex items-center">
                        <Icon name="Clock" size={16} className="mr-2" />
                        <span>Осталось 3 дня</span>
                      </div>
                    </div>
                    <Button className="w-full gradient-purple-pink border-0" size="lg">
                      Пройти опрос
                      <Icon name="ChevronRight" size={18} className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2">Результаты опросов</h1>
              <p className="text-muted-foreground text-lg">
                Анализ данных и статистика в реальном времени
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-border/40 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur">
                <CardHeader>
                  <CardDescription>Всего опросов</CardDescription>
                  <CardTitle className="text-4xl">156</CardTitle>
                  <div className="flex items-center text-green-400 text-sm pt-2">
                    <Icon name="TrendingUp" size={16} className="mr-1" />
                    <span>+12% за неделю</span>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur">
                <CardHeader>
                  <CardDescription>Участников</CardDescription>
                  <CardTitle className="text-4xl">24.5K</CardTitle>
                  <div className="flex items-center text-green-400 text-sm pt-2">
                    <Icon name="TrendingUp" size={16} className="mr-1" />
                    <span>+28% за неделю</span>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-border/40 bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur">
                <CardHeader>
                  <CardDescription>Среднее участие</CardDescription>
                  <CardTitle className="text-4xl">157</CardTitle>
                  <div className="flex items-center text-green-400 text-sm pt-2">
                    <Icon name="TrendingUp" size={16} className="mr-1" />
                    <span>+8% за неделю</span>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="space-y-6">
              {results.map((result, index) => (
                <Card key={index} className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{result.question}</CardTitle>
                      <div className="flex items-center text-muted-foreground">
                        <Icon name="Users" size={18} className="mr-2" />
                        <span className="font-medium">{result.totalVotes.toLocaleString()} голосов</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {result.options.map((option, optIndex) => (
                      <div key={optIndex} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{option.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">
                              {option.votes.toLocaleString()} голосов
                            </span>
                            <span className="font-bold text-primary">{option.percentage}%</span>
                          </div>
                        </div>
                        <Progress value={option.percentage} className="h-3" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Динамика участия</CardTitle>
                <CardDescription>Количество голосов за последние 7 дней</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[420, 380, 520, 480, 620, 580, 720].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg gradient-purple-pink transition-all hover:opacity-80"
                        style={{ height: `${(value / 720) * 100}%` }}
                      ></div>
                      <span className="text-xs text-muted-foreground">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][index]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-purple-pink flex items-center justify-center">
                <Icon name="BarChart3" className="text-white" size={18} />
              </div>
              <span className="font-bold gradient-text">PollHub</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 PollHub. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;