export default (props: {
    pageName: string,
    back: () => void,
    forward: () => void,
    min: number,
    max: number,
    current: number
}) => {
   return (
       <div className="flex justify-center print:hidden">
           <div className="grid lg:grid-cols-3 gap-6">
               <div>
                   {props.current > props.min && (<button onClick={props.back}>Назад</button>)}
               </div>
               <span className="lg:flex items-center text-blue-500 font-bold text-xl text-center block">
                                    {props.pageName}
               </span>
               <div>
                   {(props.current < props.max) && (<button  onClick={props.forward}>Вперед</button>)}
               </div>
           </div>
       </div>
   )
}
