import React, { useState, useEffect } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { renderToNodeStream } from "react-dom/server";
import { use } from "react";

//create your first component
const Home = () => {
	const [input, setInput] = useState('')
	const [tareas, setTareas] = useState([])

	const createUserIfNotExists = () => {
		fetch('https://playground.4geeks.com/todo/users/naiomi')
			.then(response => {
				if (response.status === 404) {
					return CreateUser();
				} else if (!response.ok) {
					console.error('Error en la respuesta:', response.status);
				} else {
					console.log('Usuario ya existente');
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
	};		
	const CreateUser = ()=>{fetch('https://playground.4geeks.com/todo/users/naiomi', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify([])
				}).then(createResponse => {
					if (!createResponse.ok) {
						throw new Error('Fallo al crear el usuario');
					}
					console.log('Usuario creado correctamente');
				});					
			}

	const ListaTareas = (e) => {
		if (e.key === 'Enter') {
			if (input === '') {
				alert('Introduce una tarea');
				return;
			}

			const tareasApi = {
				label: input,
				is_done: false
			};

			setInput('');
			fetch('https://playground.4geeks.com/todo/todos/naiomi', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(tareasApi)
			})
				.then(response => {
					if (!response.ok) {
						throw new Error('Error al actualizar las tareas');
					}
					console.log('Tarea subida correctamente');
					getTareas()
				})
				.catch(error => {
					console.error('Error:', error);
				});
		}
	}
	const handleRemove = (id) => {


		fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}

		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Error al actualizar las tareas');
				}
				console.log('Tareas actualizadas correctamente');
				getTareas();
			})
			.catch(error => {
				console.error('Error:', error);
			});

	}


	const handleCleanMessage = () => {
		if (tareas.length === 0) {
			setInput('')
		}
	}
	const getTareas = () => {
		fetch('https://playground.4geeks.com/todo/users/naiomi')
			.then(response => response.json())
			.then(data => {
				const TareasLength = data.todos;
				setTareas(TareasLength);
				if (TareasLength.length === 0) {
					setInput('No hay tareas, introduce una');
				}
			})
			.catch(error => {
				console.error('Error:', error);
			});
	}
	useEffect(() => {
		createUserIfNotExists();
		getTareas();
		
	}
	, []);
	return (
		<div className="ContenedorTareas ">
			<h1>LISTA DE TAREAS</h1>

			<input className="input" type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={ListaTareas} onMouseEnter={handleCleanMessage} placeholder="Introduce tarea 📝" />

			<ul>
				{tareas.map((tarea, index) => <div className="listaOrdenada" key={index}>
					<li className="lista">{tarea.label}</li>
					<button className="boton-eliminar" onClick={() => handleRemove(tarea.id)}>🗑️</button>

				</div>)}
			</ul>
			


		</div>

	);
};


export default Home;