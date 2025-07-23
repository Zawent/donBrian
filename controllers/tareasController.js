import inquirer from 'inquirer';
import _ from 'lodash';
import { guardarTareas } from '../utils/archivos.js';
import { tareas } from '../data/tareas.js';

export async function agregarTarea() {
  const { descripcion } = await inquirer.prompt([
    { type: 'input', name: 'descripcion', message: 'Descripción de la tarea:' }
  ]);

  const desc = descripcion.trim();

  // Validaciones
  if (_.isEmpty(desc)) {
    console.log('⚠️ No puedes ingresar una tarea vacía.');
    return;
  }

  const duplicada = _.some(tareas, t => t.descripcion.toLowerCase() === desc.toLowerCase());
  if (duplicada) {
    console.log('⚠️ Ya existe una tarea con esa descripción.');
    return;
  }

  const nueva = {
    id: Date.now(),
    descripcion: desc,
    completada: false
  };

  tareas.push(nueva);
  guardarTareas(tareas);
  console.log('✅ Tarea agregada y guardada.');
}

export function listarTareas() {
  if (_.isEmpty(tareas)) {
    console.log('📭 No hay tareas registradas.');
    return;
  }

  // Ordenar por estado (pendientes primero) y luego por descripción
  const ordenadas = _.orderBy(tareas, ['completada', 'descripcion'], ['asc', 'asc']);

  console.log('\n📋 Lista de tareas:');
  ordenadas.forEach((tarea, i) => {
    const estado = tarea.completada ? '✅' : '❌';
    console.log(`${i + 1}. [${estado}] ${tarea.descripcion}`);
  });
}

export async function editarTarea() {
  if (_.isEmpty(tareas)) {
    console.log('⚠️ No hay tareas para editar.');
    return;
  }

  const { indice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'indice',
      message: 'Selecciona una tarea para editar:',
      choices: tareas.map((t, i) => ({
        name: t.descripcion,
        value: i
      }))
    }
  ]);

  const { nuevaDescripcion } = await inquirer.prompt([
    { type: 'input', name: 'nuevaDescripcion', message: 'Nueva descripción:' }
  ]);

  const nueva = nuevaDescripcion.trim();
  if (_.isEmpty(nueva)) {
    console.log('⚠️ La descripción no puede estar vacía.');
    return;
  }

  tareas[indice].descripcion = nueva;
  guardarTareas(tareas);
  console.log('✏️ Tarea actualizada y guardada.');
}

export async function eliminarTarea() {
  if (_.isEmpty(tareas)) {
    console.log('⚠️ No hay tareas para eliminar.');
    return;
  }

  const { indice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'indice',
      message: 'Selecciona una tarea para eliminar:',
      choices: tareas.map((t, i) => ({
        name: t.descripcion,
        value: i
      }))
    }
  ]);

  const { confirmar } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmar',
      message: '¿Estás seguro de eliminar esta tarea?',
      default: false
    }
  ]);

  if (!confirmar) {
    console.log('❎ Cancelado.');
    return;
  }

  tareas.splice(indice, 1);
  guardarTareas(tareas);
  console.log('🗑️ Tarea eliminada y cambios guardados.');
}
