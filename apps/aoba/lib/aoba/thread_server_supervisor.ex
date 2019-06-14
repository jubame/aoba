defmodule Aoba.ThreadServerSupervisor do
  use Supervisor
  alias Aoba.ThreadServer

  def start_thread() do
    # Este supervisor está configurado en init con hijo Game.
    # Por lo tanto, esto llamará a Game.start_link(name)
    id = {DateTime.utc_now(), Node.self()}
    Supervisor.start_child(__MODULE__, [id])
  end

  def stop_thread(name) do
    Supervisor.terminate_child(__MODULE__, pid_from_name(name))
  end

  # Llamado por IslandsEngine.Supervisor, la raíz.
  def start_link(_options) do
    # Supervisor.start_link/3 triggers the init/1 callback function
    Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    # Esto configura, pero todavia no inicia nada
    Supervisor.init([ThreadServer], strategy: :simple_one_for_one)
  end

  defp pid_from_name(name) do
    name
    |> ThreadServer.via_tuple()
    |> GenServer.whereis()
  end

  @docp """

  Desde el explorador: window.new_thread()

  iex(8)> alias Aoba.ThreadServerSupervisor
  Aoba.ThreadServerSupervisor
  iex(9)>
  nil
  iex(10)>
  nil
  iex(11)> Supervisor.which_children(ThreadServerSupervisor)
  []
  iex(12)>
  nil
  iex(13)>
  nil
  iex(14)> Supervisor.which_children(ThreadServerSupervisor)
  []
  iex(15)> [debug] INCOMING "new_thread" on "threadserver:lobby" to AobaWeb.ThreadServerChannel
    Parameters: nil

  nil
  iex(16)>
  nil
  iex(17)> Supervisor.which_children(ThreadServerSupervisor)
  [{:undefined, #PID<0.455.0>, :worker, [Aoba.ThreadServer]}]

  iex(20)> [{_nada, pid, _nada2, _nada3}] = Supervisor.which_children(ThreadServerSupervisor)
  [{:undefined, #PID<0.455.0>, :worker, [Aoba.ThreadServer]}]
  iex(21)> pid
  #PID<0.455.0>
  iex(22)>
  nil
  iex(23)>
  nil
  iex(24)> :sys.get_status(pid)
  {:status, #PID<0.455.0>, {:module, :gen_server},
  [
    [
      "$initial_call": {Aoba.ThreadServer, :init, 1},
      "$ancestors": [Aoba.ThreadServerSupervisor, Aoba.Supervisor, #PID<0.247.0>]
    ],
    :running,
    #PID<0.251.0>,
    [],
    [
      header: {'Status for generic server', {Registry.Game, []}},
      data: [
        {'Status', :running},
        {'Parent', #PID<0.251.0>},
        {'Logged events', []}
      ],
      data: [
        {'State',
          %Aoba.Thread{
            post_id: 2,
            posts: %{
              1 => %Aoba.Post{
                body: %Aoba.Body{
                  auto_id: 2,
                  entries: %{
                    1 => {#DateTime<2019-06-14 16:54:51.505932Z>, :nonode@nohost}
                  }
                },
                date: #DateTime<2019-06-14 16:54:51.520292Z>,
                id: 1,
                media: "",
                username: "anon"
              }
            },
            thread_id: {#DateTime<2019-06-14 16:54:51.516255Z>, :nonode@nohost}
          }}
      ]
    ]
  ]}


  """


end
