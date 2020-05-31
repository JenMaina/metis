<div class="sidebar">
    <ul class="widget widget-menu unstyled">
    <li ><a class="{{ request()->is('doctor') ? 'active' : ''}}" href="{{url('doctor/')}}"><i class="menu-icon icon-home"></i>Home
        </a></li>
        <li><a class="" href="#"><i class="menu-icon icon-bullhorn"></i>Scheduled Appointment</a>
        </li>
            <li><a class="" href="#"><i class="menu-icon icon-suitcase"></i>Conference Room</a></li>
    </ul>
    <ul class="widget widget-menu unstyled">
        <li><a class="collapsed " data-toggle="collapse" href="#togglePages"><i class="menu-icon icon-cog">
        </i><i class="icon-chevron-down pull-right"></i><i class="icon-chevron-up pull-right">
        </i>Account Settings</a>
            <ul id="togglePages" class="collapse unstyled">
                <li><a href="#"><i class="icon-eye-open"></i>View Profile </a></li>
                <li><a class="" href="#"><i class="icon-bolt"></i>Change Password </a></li>
            </ul>
        </li>
        <li><a href="{{ route('doctor.logout') }}"  onclick="event.preventDefault();
            document.getElementById('logout-form1').submit();"><i class="menu-icon icon-signout"></i>Logout </a></li>
            <form id="logout-form1" action="{{ route('doctor.logout') }}" method="POST" style="display: none;">
                @csrf
            </form>
    </ul>
</div>
<!--/.sidebar-->