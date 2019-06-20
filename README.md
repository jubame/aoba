# Aoba.Umbrella
# Iniciamos con un nombre de nodo <numero>@<nombre_maquina>. El número de
# nodo tiene que estar entre 1 y 9.
iex --name "1@localhost" -S mix phx.server

# Iniciamos desde el navegador web un nuevo hilo
newThread("ejejej")

# Aparecerá en el HTML el id del hilo:
<article data-v-5e1bd625="" data-v-b4fa90ca="" data-type="thread" id="15608779361">

# Añadir contenido:
appendToBodyEntry(15608779361, 1, 1, "kokoko")
appendToBodyEntry(15608779361, 1, 1, "kokoko")
appendToBodyEntry(15608779361, 1, 1, "今日も一日頑張るぞい！")

# Veamos el resultado en iex:
iex(1@localhost)4> alias Aoba.ThreadServer
Aoba.ThreadServer
iex(1@localhost)28> :sys.get_state(ThreadServer.via_tuple(15608779361))
%Aoba.Thread{
  post_id: 2,
  posts: %{
    1 => %Aoba.Post{
      body: %Aoba.Body{ 
        auto_id: 2,
        entries: %{
          1 => "ejejej kokoko kokoko 今日も一日頑張るぞい！"
        }
      },
      date: #DateTime<2019-06-18 17:32:41.351843Z>,
      id: 1,
      media: "",
      username: "anon"
    }
  },
  thread_id: 15608779361
}