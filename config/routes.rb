Rails.application.routes.draw do
  resources :tasks, only: %w{create update destroy} do
    member do
      put :done
    end
  end
  root 'tasks#index'
end
