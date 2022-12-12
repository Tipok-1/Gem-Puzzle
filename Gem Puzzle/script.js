let body = document.querySelector('body');
let audio = new Audio('sound.mp3');
let no_audio = false;
function play_audio(){
    if(!no_audio)
    {
        audio.play();
    }
}

let main_div = document.createElement('div');
main_div.classList.add('main_div');

let block_info = document.createElement('div');
block_info.classList.add('block_info');
block_info.innerHTML = 'Click start';
main_div.appendChild(block_info);

let menu = document.createElement('div');
menu.classList.add('menu');
let start = document.createElement('input');
start.type = 'button';
start.value = 'Shuffle and start';
start.classList.add('buttons');
let stop_bt = document.createElement('input');
stop_bt.type = 'button';
stop_bt.value = 'Start';
stop_bt.classList.add('buttons');
let save = document.createElement('input');
save.type = 'button';
save.value = 'Save';
save.classList.add('buttons');
let results = document.createElement('input');
results.type = 'button';
results.value = 'results';
results.classList.add('buttons');
menu.appendChild(start);
menu.appendChild(stop_bt );
menu.appendChild(save);
menu.appendChild(results);

save.addEventListener('click',save_function);

let best_results = [];
let have_result  = localStorage.getItem(`have_result`)?Number(localStorage.getItem(`have_result`)):0;
//localStorage.clear();
function check_best_result(){
    for(let i =0; i < have_result;i++){
        let str = localStorage.getItem(`result${i}`);
        best_results.push(str);
    }
    if(best_results.length < 10)
    {
        for(let i = best_results.length +1; i<11; i++)
        {
            best_results.push(`${i}. -------------------------------------`);
        }
    }
    if(best_results.length > 10)
    {
        for(let i = best_results.length-1; i>10; i++)
        {
            best_results.pop(best_results[i]);
        }
    }
}
check_best_result();


let open_result = false;
let stop_game = true;
results.addEventListener('click',()=>{
    if(!open_result)
    {
        if(!stop_game)
        {
            stop_bt.click();
        }
        results.value = 'close results'
        let str = 'Best result<br><br>';
        for(let i = 0; i<best_results.length;i++)
        {
            str += `${best_results[i]}<br>`;
        }
        block_info.innerHTML = str;
        block_info.style.fontSize = '1.5em';
        block_info.style.display = 'flex';
        open_result = true;
    }
    else{
        results.value = 'results'
        open_result = false;
        block_info.style.fontSize = '3em';
        block_info.innerHTML = 'Click start'
    }
    //block_info.style.fontSize = '3em';
})

let moves_and_time = document.createElement('div');
moves_and_time.classList.add('moves_and_time');
let moves = document.createElement('dive');
moves.classList.add('moves');
moves.innerHTML = 'Moves: 0';
let time = document.createElement('div');
time.classList.add('time');
time.innerHTML = `Time: 0`;
let stop_sound = document.createElement('div');
stop_sound.classList.add('stop_sound');
let contunie = document.createElement('input');
contunie.type = 'button';
contunie.value = 'contunie';
contunie.classList.add('buttons');
contunie.classList.add('contunie');
moves_and_time.appendChild(contunie);
moves_and_time.appendChild(moves);
moves_and_time.appendChild(time);
moves_and_time.appendChild(stop_sound);

contunie.addEventListener('click', contunie_function);

stop_sound.addEventListener('click',()=>{
    if(no_audio == false)
    {
        no_audio = true;
        stop_sound.style.backgroundImage = "url('audio_off.png')";
    }
    else{
        no_audio = false;
        stop_sound.style.backgroundImage = "url('audio_on.png')";
    }
})

let second = 0;
let minuts = 0;
let hours = 0;
let time_interval = null;
function plus_second(){
    second++;
    if(second == 60)
    {
        second =0;
        minuts++;
    }
    if(minuts == 60)
    {
        minuts = 0;
        hours++;
    }

    if(minuts == 0 && hours == 0)
    {
        time.innerHTML = `Time: ${second}s`;
    }
    else if(minuts != 0 && hours == 0){
        time.innerHTML = `Time: ${minuts}m ${second}s`;
    }
    else if(hours != 0)
    {
        time.innerHTML = `Time: ${hours}h ${minuts}m ${second}s`;
    }
}
stop_bt.addEventListener('click',()=>{
    if(open_result){
        results.click();
    }
    block_info.style.fontSize = '3em';
    if(stop_game)
    {
        if(time_interval == null)
            time_interval = setInterval(plus_second,1000);
        stop_bt.value = 'Stop';
        block_info.style.display = 'none';
        stop_game = false;
    }
    else{
        clearInterval(time_interval);
        time_interval = null;
        stop_bt.value = 'Start';
        block_info.innerHTML = 'Click start';
        block_info.style.display = 'flex';
        stop_game = true;
    }
})

let game_field = document.createElement('div');
game_field.classList.add('game_field');
let now_block = 0;
let was_empty = false;
function setBlocks(nums, rows){
    if(nums != now_block)
    {
        while(game_field.firstChild){
            game_field.removeChild(game_field.lastChild);
        }
        for(let i = 0; i < nums; i++){
            let el =  document.createElement('div');
            el.classList.add('block');
            el.style.order = i;
            game_field.appendChild(el);
        }
        game_field.style.gridTemplateColumns = `repeat(${rows},1fr)`;
        game_field.style.gridTemplateRows = `repeat(${rows},1fr)`;
        now_block = nums;
        setBlockValues(nums)
    }
}
function random(min, max){
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}
function setBlockValues(nums){
    let blokcs = game_field.querySelectorAll('.block');
    let arr = [];
    let check_solvability = [];
    for(let i = 0; i< nums-1; i++)
    {
        arr.push(i+1);
        if(blokcs[i].classList.contains('empty'))
            blokcs[i].classList.remove('empty')
    }
    let rand;
    for(let i = 0; i< nums-1; i++)
    {
        rand = random(0, arr.length-1);
        blokcs[i].innerHTML = `${arr[rand]}`;
        check_solvability.push(arr[rand]);
        arr.splice(rand,1);
    }
    for(el of blokcs)
    {
        el.addEventListener('click',click_on_block);
    }

    //let k =  make_solvability(check_solvability,Math.sqrt(nums));}
    let k =  make_solvability(check_solvability,Math.sqrt(nums));
    let row = Math.sqrt(nums) - k;
    let col = row;
    let index  = (row*Math.sqrt(nums)) + col;
    let last = null;
    if(index != nums-1)
    {
        for(let i = index; i < nums; i++)
        {
            if(i == index)
            {
                last = blokcs[i+1].innerHTML;
                blokcs[i+1].innerHTML = blokcs[i].innerHTML;
                blokcs[i].classList.add('empty');
                blokcs[i].innerHTML = '';
            }
            else{
                if(i != nums-1)
                {
                    let p = blokcs[i+1].innerHTML;
                    blokcs[i+1].innerHTML = last;
                    last = p;
                }
            }
        }
    }
    else{
        blokcs[index].classList.add('empty');
        blokcs[index].innerHTML = '';
    }
    if(k%2!=0){
        let ind = index;
        let last_value = blokcs.length-1 != ind ? blokcs[blokcs.length-1] : blokcs[blokcs.length-2];
        if(blokcs.length-1 ==ind)
            --ind;
        let pred_last =  blokcs.length-2 != ind ? blokcs[blokcs.length-2] : blokcs[blokcs.length-3];
        let v = last_value.innerHTML;
        last_value.innerHTML = pred_last.innerHTML;
        pred_last.innerHTML = v;
    }
}
function make_solvability(arr, lines){
    let sum = 0;
    let num_was = [];
    for(let i = 0; i< arr.length; i++)
    {
        let num = arr[i] - 1;
        while(num != 0){
            if(!num_was.includes(num))
            {
                sum++
            }
            num--
        }
        num_was.push(arr[i]);
    }
    let peek_row = [];
    for(i = 1;i<lines+1;i++)
    {
        if(sum%2 != 0){
            if(i%2 != 0){
                peek_row.push(i);
            }
        }
        else{
            if(i%2 == 0){
                peek_row.push(i);
            }
        }
    }
    //console.log(sum);
    let row;
    if(peek_row.length == 1)
    {
        row = peek_row[0];
    }
    else{
        row = peek_row[random(0, peek_row.length-1)];
    }
    return row;
    
}
let values_array = [];
let timer;
let number_moves = 0;
function click_on_block(e){
    if(!e.currentTarget.classList.contains('empty'))
    {   
        ++number_moves;
        moves.innerHTML = `Moves: ${number_moves}`;
        let bloks = game_field.querySelectorAll('.block');
        if(values_array.length == 0)
        {
            for(let i = 0; i<bloks.length;i++)
            {
                if(bloks[i].classList.contains('empty'))
                {
                    values_array.push(-1);
                }
                else{
                    values_array.push(Number(bloks[i].innerHTML));
                }
            }
        }
        let width = parseFloat(window.getComputedStyle(e.currentTarget,null).getPropertyValue("width"));
        let height =  parseFloat(window.getComputedStyle(e.currentTarget,null).getPropertyValue("height"));
        let empty = game_field.querySelector('.empty');
        let index = values_array.indexOf(Number(e.currentTarget.innerHTML));
        let empty_index = values_array.indexOf(-1);
        if(!timer)
        {    
            timer = setTimeout(()=>(timer = clearTimeout(timer)), 550);
            if(empty_index % Math.sqrt(bloks.length) != Math.sqrt(bloks.length) - 1)
            {
                if(empty_index+1 == index)
                {
                    play_audio();
                    empty.style.left = `${ parseFloat(window.getComputedStyle(empty,null).getPropertyValue("left")) + width}px`;
                    e.currentTarget.style.left = `${ parseFloat(window.getComputedStyle(e.currentTarget,null).getPropertyValue("left")) - width}px`
                    values_array[empty_index] = values_array[index];
                    values_array[index] = -1;
                }
            }
            if(empty_index%Math.sqrt(bloks.length) != 0)
            {
                if(empty_index-1 == index)
                {
                    play_audio();
                    empty.style.left = `${ parseFloat(window.getComputedStyle(empty,null).getPropertyValue("left")) - width}px`;
                    e.currentTarget.style.left = `${ parseFloat(window.getComputedStyle(e.currentTarget,null).getPropertyValue("left")) + width}px`
                    values_array[empty_index] = values_array[index];
                    values_array[index] = -1;
                }
            }
            if((empty_index - Math.sqrt(bloks.length) == index))
            {
                play_audio();
                empty.style.top = `${ parseFloat(window.getComputedStyle(empty,null).getPropertyValue("top")) - height}px`;
                e.currentTarget.style.top = `${ parseFloat(window.getComputedStyle(e.currentTarget,null).getPropertyValue("top")) + height}px`
                values_array[empty_index] = values_array[index];
                values_array[index] = -1;
            }
            if((empty_index + Math.sqrt(bloks.length) == index)){
                play_audio();
                empty.style.top = `${ parseFloat(window.getComputedStyle(empty,null).getPropertyValue("top")) + height}px`;
                e.currentTarget.style.top = `${ parseFloat(window.getComputedStyle(e.currentTarget,null).getPropertyValue("top")) - height}px`
                values_array[empty_index] = values_array[index];
                values_array[index] = -1;
            }
        }
        //timer = setTimeout(()=>(timer = clearTimeout(timer)), 550);
        check_wins();
        
    }
}
function check_wins(){
    let check_win = 0;
    for(let i =0;i<values_array.length;i++){
        if(i!= values_array.length-1 && values_array[i] == i+1)
        {
            check_win++;
        }
        if(i== values_array.length-1 &&  values_array[i] == -1)
        {
            check_win++;
        }
    }
    if(check_win == values_array.length)
    {
        let title= `«Ура! Вы решили головоломку за ${minuts}::${second} и ${number_moves} ходов!»`;
        let score = (Math.sqrt(now_block)*400)-(number_moves + (minuts*60) + second);
        let res = `«Головоломка ${Math.sqrt(now_block)}x${Math.sqrt(now_block)} решена за ${minuts}::${second} и ${number_moves} ходов! (score ${score})»`
        reset();
        block_info.innerHTML = title;
        stop_bt.disabled = true;
        save.disabled = true;
        

        let all_result = [];
        all_result_value = [];
        for(let i = 0; i < have_result;i++)
        {
            if(best_results.length !=0)
            {
                console.log(best_results[i]);
                if(best_results[i].lastIndexOf('(') != -1){
                    all_result.push(parseInt(best_results[i].slice(best_results[i].lastIndexOf('(')+7)));
                }
                all_result_value.push(localStorage.getItem(`result${i}`))
            }
        }
        all_result.push(score);
        all_result_value.push(res);
        all_result.sort((a,b)=>{return b-a});
        console.log(all_result_value);
       for(let i = 0; i<all_result_value.length;i++)
       {
            for(let j = i; j < all_result.length;j++)
            {
                if(parseInt(all_result_value[j].slice(all_result_value[i].lastIndexOf('(')+7)) == all_result[i])
                {
                    let p = all_result_value[i]
                    all_result_value[i] = all_result_value[j];
                    all_result_value[j] = p;
                    break;
                }
            }
       }
       have_result = 0;
       for(let i = 0; i< all_result_value.length;i++)
       {
            if(i<10)
            {
                localStorage.setItem(`result${i}`,all_result_value[i]);
                best_results[i] = `${i+1}. ${all_result_value[i]}`;
                have_result++;
                localStorage.setItem('have_result',have_result);
            }
            else{
                break;
            }
       }

    }
}
let field_size = 4;
function save_function(){
    let bloks = game_field.querySelectorAll('.block');
    for(let i = 0; i < now_block;i++){
        if(values_array.length == 0)
        {           
            localStorage.setItem(`block${i}`,String(bloks[i].innerHTML));
            
        }
        else{
            localStorage.setItem(`block${i}`,String(values_array[i]));
        }
    }
    let tm = String(((minuts*60)+second));
    localStorage.setItem('time',tm);
    localStorage.setItem('moves',String(number_moves));
    localStorage.setItem('field_size',String(field_size));
    localStorage.setItem('now_block',String(now_block));
    contunie.style.visibility = 'visible';
}
//localStorage.clear();
if(!localStorage.getItem('now_block'))
{
    contunie.style.visibility = 'hidden';
}
function contunie_function(){
    if(localStorage.getItem('now_block'))
    {
        n = Number(localStorage.getItem('now_block'));
        values_array = [];
        setBlocks(n, Math.sqrt(n));
        let bloks = game_field.querySelectorAll('.block');
        for(let i = 0; i < now_block; i++)
        {
            if(localStorage.getItem(`block${i}`) == '-1' || localStorage.getItem(`block${i}`) == '')
            {
                bloks[i].innerHTML = '';
                bloks[i].classList.add('empty');
            }
            else{
                if(bloks[i].classList.contains('empty'))
                {
                    bloks[i].classList.remove('empty');
                }
                bloks[i].innerHTML = localStorage.getItem(`block${i}`);
            }

            if(localStorage.getItem(`block${i}`) == '')
            {
                values_array.push(-1);
            }
            else{
                values_array.push(Number(localStorage.getItem(`block${i}`)));
            }

        }
        number_moves = Number(localStorage.getItem('moves'));
        moves.innerHTML = `Moves: ${number_moves}`;
        field_size = Number(localStorage.getItem('field_size'));
        frame_size.innerHTML = `Frame size ${field_size}x${field_size}`;
        second = Number(localStorage.getItem('time'))-1;
        plus_second();
        if(!stop_game)
        stop_bt.click();
    }
}

window.addEventListener('resize',(e)=>{
    let bloks = game_field.querySelectorAll('.block');
    for(let i = 0; i < bloks.length;i++){
        bloks[i].style.left = '0';
        bloks[i].style.top = '0';
    }
    reset();
    frame_size.innerHTML = 'Frame size 4x4';
})
setBlocks(16, 4);



let frame_size = document.createElement('div');
frame_size.classList.add('frame_size');
frame_size.innerHTML = 'Frame size 4x4';

let peck_frame_size = document.createElement('div');
peck_frame_size.classList.add('peck_frame_size');
peck_frame_size.innerHTML = 'Other sizes: '
for(let i = 0; i < 6; i++){
    let el =  document.createElement('span');
    el.classList.add('variant');
    el.innerHTML = `${i+3}x${i+3}`;
    el.addEventListener('click',peck_size);
    peck_frame_size.appendChild(el);
}

function peck_size(e){
    let nums = parseInt(e.currentTarget.innerHTML);
    if(Math.sqrt(now_block) != nums){
        reset();
        frame_size.innerHTML = `Frame size ${nums}x${nums}`;
        field_size = nums;
        setBlocks(nums*nums, nums);
    }
}
function reset(){
    if(open_result){
        results.click();
    }
    block_info.style.fontSize = '3em';
    second = 0;
    minuts = 0;
    hours = 0;
    time.innerHTML = `Time: 0`;
    block_info.innerHTML = 'Click start';
    if(!stop_game)
        stop_bt.click();
    number_moves = 0;
    moves.innerHTML = `Moves: ${number_moves}`;
    values_array = [];
    if(stop_bt.disabled == true)
    {
        stop_bt.disabled = false;
        save.disabled = false;
    }
}
start.addEventListener('click',()=>{
    let n = Math.sqrt(now_block);
    reset();
    now_block = 0;
    setBlocks(n*n, n);
    stop_bt.click();
    //setBlocks(nums*nums, nums);

})

main_div.appendChild(menu);
main_div.appendChild(moves_and_time);
main_div.appendChild(game_field);
main_div.appendChild(frame_size);
main_div.appendChild(peck_frame_size);
body.appendChild(main_div);