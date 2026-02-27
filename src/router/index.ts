import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboards'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    
    // Control domain: Dashboard
    {
      path: '/dashboards',
      name: 'Dashboards',
      component: () => import('@/pages/DashboardsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboards/new',
      name: 'DashboardNew',
      component: () => import('@/pages/DashboardNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboards/:id',
      name: 'DashboardEdit',
      component: () => import('@/pages/DashboardEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Create domain: Post
    {
      path: '/posts',
      name: 'Posts',
      component: () => import('@/pages/PostsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/new',
      name: 'PostNew',
      component: () => import('@/pages/PostNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/posts/:id',
      name: 'PostView',
      component: () => import('@/pages/PostViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Create domain: Comment
    {
      path: '/comments',
      name: 'Comments',
      component: () => import('@/pages/CommentsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/comments/new',
      name: 'CommentNew',
      component: () => import('@/pages/CommentNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/comments/:id',
      name: 'CommentView',
      component: () => import('@/pages/CommentViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Consume domain: Classification
    {
      path: '/classifications',
      name: 'Classifications',
      component: () => import('@/pages/ClassificationsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/classifications/:id',
      name: 'ClassificationView',
      component: () => import('@/pages/ClassificationViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Profile
    {
      path: '/profiles',
      name: 'Profiles',
      component: () => import('@/pages/ProfilesListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profiles/:id',
      name: 'ProfileView',
      component: () => import('@/pages/ProfileViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Admin route
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based authorization
  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    // Redirect to default page if user doesn't have required role
    next({ name: 'Dashboards' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Creators Dashboard Login' : 'Dashboard'
})

export default router