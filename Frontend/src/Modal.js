import { Dialog, Transition } from "@headlessui/react";
import ReactCodeMirror from "@uiw/react-codemirror";
import axios from "axios";
import React, { Fragment, useEffect, useRef, useState } from "react";
import Loading from "./Loading";
function Modal({urls,id,makeChange}) {
  const cancelButtonRef = useRef(null);
  const [open, setopen] = useState(false);
  const [template, settemplate] = useState()
  const [templates, settemplates] = useState([])
  const [change, setchange] = useState(false)
  const [name, setname] = useState("")
  const [loading, setloading] = useState(false)
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('api/yaml')
      settemplates(data)
      !template && settemplate(data.length > 0 && data[0])
    }
    setloading(true)
    getData()
    setloading(false)
  }, [change])

  const saveTemplate = async (id) => {
    console.log(template?.value);
    await axios.post(`/api/yaml/${id}`, { value: template?.value })
    setchange(!change)
  }

  const onChange = React.useCallback((value, viewUpdate) => {
    console.log('value:', value);
    settemplate(template => ({ ...template, value: value }))
  }, []);

  const onSubmitHandler = () => {
    axios.post('/api/runnuclei',{domainid:id,urls:urls.join('\n'),templateid:template._id})
    console.log("yello");
    makeChange()
    setopen(false)
  }
  const addTemplate = async (e) => {
    e.preventDefault()
    await axios.post('/api/yaml', { name: name })
    setchange(!change)
    setname("")
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {setopen(true);settemplate(templates[0])}}
        className="bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300"
      >
        Add Template
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setopen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-zinc-800 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full">
                  <div className="relative rounded-lg shadow dark:bg-zinc-800">


                    <button
                      onClick={() => setopen(false)}
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                      data-modal-toggle="authentication-modal"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>


                    <div className="py-6 px-6 lg:px-8">
                      <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                        Paste your Template
                      </h3>
                      <label for="first_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Add new template</label>
                      <form onSubmit={addTemplate}>
                        <div className="flex gap-2 mb-2">
                          <div className="w-3/4">
                            <input onChange={(e) => { setname(e.target.value) }} value={name} type="text" id="first_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name of the template" required />
                          </div>
                          <div>
                            <button
                              type="submit"
                              className="bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300"
                            >
                              Add Template
                            </button>
                          </div>
                        </div>
                      </form>
                      <label for="templates" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                      
                      {loading ? <Loading/>:  templates.length>0 && (
                        <>
                          <select id="templates"
                            onChange={(e) => { console.log(e.target.value); settemplate(templates[e.target.value]) }}
                            className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {templates.map((x, i) => (
                              <option key={x._id} value={i}>{x.name}</option>
                            ))}
                          </select>
                          <ReactCodeMirror
                            value={template?.value}
                            height="200px"
                            theme="dark"
                            options={{
                              mode: 'yaml',
                              lineNumbers: true,
                            }}
                            onChange={onChange}
                          />
                          <button
                            type="submit"
                            onClick={() => saveTemplate(template?._id)}
                            className="mt-3 bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300"
                          >
                            Save Template
                          </button>
                        </>
                      )}
                      <div className="space-y-6 mt-5">
                        <button
                          type="submit"
                          onClick={onSubmitHandler}
                          className="w-full bg-transparent hover:bg-slate-700 text-gray-200 font-semibold hover:text-gray-300 py-2 px-4 border border-gray-300"
                        >
                          Run Scan
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default Modal;
