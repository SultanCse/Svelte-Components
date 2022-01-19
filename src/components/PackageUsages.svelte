<script>
    import Scrollbar from 'smooth-scrollbar'
    import Litepicker from 'litepicker';
    import { onDestroy, onMount } from 'svelte';
    let prop;
    let tableData =[1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3]
    const options ={ 
        element: document.getElementById('datepicker'),
        singleMode: false,
        delimiter : ' - ',
        format : 'DD/MM/YYYY',
        inlinemode: true,
        numberOfMonths: 1,
        position: 'top',
    }

    onMount(()=>{
        if(document.querySelector('#my-scrollbar')){
            Scrollbar.init(document.querySelector('#my-scrollbar'), {alwaysShowTracks: true});
        }

        if(document.getElementById('datepicker')){
            const picker = new Litepicker({
                element: document.getElementById('datepicker'),
                singleMode: false,
                delimiter : ' - ',
                format : 'DD/MM/YYYY',
                inlinemode: true,
                numberOfMonths: 1,
                position: 'top',
            })
        }
    })

    onDestroy(()=>{
        if(document.querySelector('#my-scrollbar')){
            Scrollbar.destroy(document.querySelector('#my-scrollbar'), {});
        }
    })

</script>

<h1>Smooth Scroll Package</h1>
<div class="scroll-content ms-4 me-4" id='my-scrollbar'>
    <table class="table table-striped">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
            </tr>
        </thead>
        <tbody>
            {#each tableData as data, index }
            <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            </tr>
            {/each}
        </tbody>
    </table>
    <!-- <div class="scrollbar-track scrollbar-track-x">
        <div class="scrollbar-thumb scrollbar-thumb-x"></div>
    </div> -->
    <div class="scrollbar-track scrollbar-track-y">
        <div class="scrollbar-thumb scrollbar-thumb-y"></div>
    </div>
</div>

<h1>Light Picker Package</h1>
<input type="text" style='min-width:10rem' id="datepicker">


<style>
 #my-scrollbar {
    max-height: 300px;
    overflow: auto;
}
</style>