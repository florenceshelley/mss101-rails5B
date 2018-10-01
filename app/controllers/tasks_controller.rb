class TasksController < ApplicationController
  before_action :find_model, only: %w{update destroy done}

  def index
    @collection = Task.order('created_at DESC').all
  end

  def create
    @model = Task.create params_form
    if @model.errors.any?
      render json: { errors: @model.errors }, status: 422
    else
      render json: {
        id:   @model.id,
        name: @model.name,
        done: @model.done
      }
    end
  end

  def update
    @model.update_attributes params_form
    if @model.errors.any?
      render json: { errors: @model.errors }, status: 422
    else
      render json: {
        id:   @model.id,
        name: @model.name,
        done: @model.done
      }
    end
  end

  def destroy
    @model.destroy
    render json: true
  end

  def done
    @model.update_attribute :done, params[:done]
    render json: true
  end

  protected
    def find_model
      @model = Task.find params[:id]
    end

    def params_form
      params.fetch(:task,{}).
        permit :name
    end
end
