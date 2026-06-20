import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./core/auth/components/login/login.component').then((c) => c.LoginComponent),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./core/auth/components/register/register.component').then(
            (c) => c.RegisterComponent,
          ),
        title: 'Register',
      },
    ],
  },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },

      {
        path: 'feed',
        loadComponent: () => import('./features/feed/feed.component').then((c) => c.FeedComponent),
        title: 'Feed',
        children: [
          { path: '', redirectTo: 'homeFeed', pathMatch: 'full' },

          {
            path: 'homeFeed',
            loadComponent: () =>
              import('./features/feed/components/home-feed/home-feed.component').then(
                (c) => c.HomeFeedComponent,
              ),
          },
          {
            path: 'myPosts',
            loadComponent: () =>
              import('./features/feed/components/my-posts/my-posts.component').then(
                (c) => c.MyPostsComponent,
              ),
          },
          {
            path: 'community',
            loadComponent: () =>
              import('./features/feed/components/community/community.component').then(
                (c) => c.CommunityComponent,
              ),
          },
          {
            path: 'saved',
            loadComponent: () =>
              import('./features/feed/components/saved/saved.component').then(
                (c) => c.SavedComponent,
              ),
          },
        ],
      },

      {
        path: 'suggestions',
        loadComponent: () =>
          import('./features/suggestions/suggestions.component').then(
            (c) => c.SuggestionsComponent,
          ),
        title: 'Suggested Friends',
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then((c) => c.ProfileComponent),
        title: 'Profile',
      },

      {
        path: 'userProfile/:id',
        loadComponent: () =>
          import('./shared/components/user-profile/user-profile.component').then(
            (c) => c.UserProfileComponent,
          ),
        title: 'Profile',
      },

      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications.component').then(
            (c) => c.NotificationsComponent,
          ),
        title: 'Notifications',
      },

      {
        path: 'changePassword',
        loadComponent: () =>
          import('./features/change-password/change-password.component').then(
            (c) => c.ChangePasswordComponent,
          ),
      },

      {
        path: 'postDetails/:id',
        loadComponent: () =>
          import('./features/post-details/post-details.component').then(
            (c) => c.PostDetailsComponent,
          ),
        title: 'Post Details',
      },
    ],
  },

  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((c) => c.NotFoundComponent),
    title: 'Page Not Found',
  },
];
