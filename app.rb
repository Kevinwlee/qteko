require 'sinatra'
require 'haml'
require 'compass'

get "/" do
  erb :index
end

get "/docket" do
  File.read(File.join('public', 'docket.html'))
end

get "/grid" do
  erb :grid
end

get "/history" do
  erb :history
end

get "/settings" do
  erb :settings
end

get "/sample-docket" do
    erb :docket
end 

get "/colophon" do
  erb :colophon
end

get "/about" do
  erb:about
end


get "/backbone" do
  File.read(File.join('public', 'backbone.html'))
end

get "/d" do
  File.read(File.join('public', 'docket.html'))
end
