// This is the bot for UI program named UOPilot with it's own syntax
// UOPilot is a scripting language designed for automating tasks in Ultima Online 
// (before, but can used in batch of UI windows)
// Bot fully created by #Rodion Ugarov
// I've added it here not to show that I'm a gamer :D
// But just to show that I'm okay with logic :) 

// Bot can:
// - Auto-find and attack targets
// - heal herself and her pet
// - return to the base when weapon is broken
// - check his self own status and orient

// the program working to get current color on the proper window
// The game where was used - Perfect World


// Key variables
set $water_key 6
set $pet_heal_key F3
set $hp_potion_key 5
set $mp_potion_key 3
set $loot_key 4
set $attack_key 2
set $ressurect_key 7
set $summon_key 8
set $fly_key f1

// Constants
set $status none
set #afk_timer 0
set #repair_time 600000
set timer 0
set $pet_started_attack false
set #afk_timer_value 50
set timer2 0
set $pet_status none
set $target_status none

// Global variables
set $security true
set $targetPos 593, 10
set $targetColor 10264259

set $myhp_pos 229, 32
set $myhp_color 5465321


set $mymp_pos 221, 42
set $mymp_color 11684620

set $return_pos 1331, 466

set $market_pos 759, 551
set $repair_all_pos 345, 568
set $close_market_pos 392, 130


// car zvezdn zhuk
set $wrong1_pos 658, 31
set $wrong1_color 2780241

// mogilny ogonek
set $wrong2_pos 682, 29
set $wrong2_color 2785376

// prizrak dezert
set $wrong3_pos 679, 29
set $wrong3_color 2785376

// zvezdn zhuk
set $wrong4_pos 691, 28
set $wrong4_color 2785376

// molodoy bez volk
set $wrong5_pos 683, 28
set $wrong5_color 2777159

// skorpion
set $wrong6_pos 668, 32
set $wrong6_color 2782038





// DON'T FORGET TO EDIT COORDINATES FOR NEIGHBORS

// PRE-WAIT
wait 1000

while 1 = 1
    set timer3 0

    // check target
    if_not $targetPos $targetColor
        set $target_status false
    else
        set $target_status true
    end_if


    // loot always
    send $loot_key

    // if we're not targeted
    if $target_status == false
        if $security == true
            // check neighbors
            sendex {T}
            sendex {T}
            wait 300
            set #a findcolor (806 345 938 359 1 1 (16777215) %arr 2)
            wait 500
            // if neighbors near
            if #a > 0
                double_kleft $return_pos
                set $status danger
                while $status == danger             // TODO: when you will get flight - create timer from fkn people to return pos
                    sendex {T}
                    sendex {T}
                    wait 500
                    set #a findcolor (806 345 938 359 1 1 (16777215) %arr 2)

                    wait 1000
                    if #a == 0
                        set $status afterAttack
                    end_if
                end_while
            end_if
        end_if


        // raise afk timer
        set #afk_timer #afk_timer + 1
        if #afk_timer > #afk_timer_value
            double_kleft $return_pos
            set #afk_timer 0
        end_if

        // loot always
        send $loot_key

        // check my hp
        if_not $myhp_pos $myhp_color
            send $hp_potion_key
        end_if

        // check my mp
        if_not $mymp_pos $mymp_color
            send $mp_potion_key
        end_if

        // return
        if timer2 > 120000
        double_kleft $return_pos
            wait 4000
            set timer2 0
        end_if


        if $status == after_attack
            set #afk_timer 0
        end_if

        // repair func
        if timer > #repair_time
            sendex {B}
            wait 1000
            left $market_pos
            wait 1000
            left $repair_all_pos
            wait 1000
            sendex {y}
            wait 1000
            left $close_market_pos


            set timer 0
        end_if

        sendex {tab}
        wait 200
        if $targetPos $targetColor
            set $target_status true
        else
            set $target_status false
            double_kleft $return_pos
        end_if



    else
        set timer3 0

        // preparation to attack


        if 1 = 1
            set $status attack
            while $status == attack
                if timer3 > 90000
                    sendex {Tab}
                end_if

                // refresh target status
                if $targetPos $targetColor
                    set $target_status true
                else
                    set $target_status false
                end_if

                // check my hp
                if_not $myhp_pos $myhp_color
                    send $hp_potion_key
                end_if

                // do we targeted?
                if $target_status == true
                    // attack module
                    sendex @{1} // ALT+1

                end_if

                // do we steel targeted?
                if $target_status == true
                    send $attack_key
                    send 1
                    wait 200
                    sendex {X}

                    // recheck target exist and attack main skill and try loot
                    if $target_status == true
                        send $loot_key
                    end_if

                    // check afk status
                    if #afk_timer > #afk_timer_value
                        double_kleft $return_pos
                    set #afk_timer 0
                    end_if

                    set #afk_timer #afk_timer + 1

                else
                    // clearing variables after attack
                    set $status after_attack
                    set $target_status false
                    set $pet_started_attack false
                    set #afk_timer 0

                    send $loot_key
                    send $loot_key
                    //wait 300
                    send $loot_key
                    send $loot_key
                    //wait 300
                    send $loot_key
                    send $loot_key
                    //wait 400
                    send $loot_key
                    send $loot_key
                    send $loot_key
                    set #afk_timer 0
                end_if





            end_if
        end_while
    end_if


end_while
