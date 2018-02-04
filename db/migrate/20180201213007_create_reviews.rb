class CreateReviews < ActiveRecord::Migration[5.1]
  def change
    create_table :reviews do |t|
      t.string :email
      t.date :date
      t.integer :rating
      t.text :comment
      t.integer :movie_id

      t.timestamps
    end
  end
end
