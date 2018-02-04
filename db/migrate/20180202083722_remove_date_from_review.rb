class RemoveDateFromReview < ActiveRecord::Migration[5.1]
  def change
    remove_column :reviews, :date, :date
  end
end
